// Importamos Sequelize
const Sequelize = require("sequelize");

// Importamos la configuración de la base de datos
require("dotenv").config();

// Importamos el logger
const logger = require("../Config/logger"); // Asegúrate de reemplazar 'path/to/logger' con la ruta correcta al archivo del logger

// Validamos que todas las variables de entorno necesarias están definidas
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME ||
  !process.env.DB_DIALECT ||
  !process.env.DB_PORT
) {
  logger.error("Falta una o más variables de entorno requeridas");
  process.exit(1);
}

// Creamos una nueva instancia de Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX),
      min: parseInt(process.env.DB_POOL_MIN),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE),
      idle: parseInt(process.env.DB_POOL_IDLE),
    },
  }
);

let dbConfig = { ...sequelize.config }; // Hacemos una copia del objeto de datos del usuario
dbConfig.PASSWORD = "********"; // Eliminamos la propiedad de la contraseña
console.log(dbConfig); // Imprimimos los datos del usuario

// Probamos la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => logger.info("Conexión a la base de datos establecida con éxito."))
  .catch((err) => logger.error("No se pudo conectar a la base de datos:", err));

// Creamos un objeto vacío para almacenar los modelos de la base de datos
const db = {};

// Asignamos Sequelize y la instancia de Sequelize al objeto db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos los modelos y los añadimos al objeto db

db.Usuario = require("./Usuario.model")(sequelize); // Usuario que realiza login
//VER ENCABEZADO Y PIE - QUIZÁS TABLA DE DATOS DE INSTITUCIÓN
db.CicloLectivo = require("./CicloLectivo.model")(sequelize); //
db.Plan = require("./Plan.model")(sequelize); //
db.Curso = require("./Curso.model")(sequelize); //
db.Division = require("./Division.model")(sequelize); //
db.Materia = require("./Materia.model")(sequelize); //
db.Condicion = require("./Condicion.model")(sequelize); // PREVIA - EQUIVALENCIA - TERCERA MATERIA - EXCEPTUADA - COLOQUIO
db.Calificacion = require("./Calificacion.model")(sequelize); // A , 1 a 10
db.Alumno = require("./Alumno.model")(sequelize); //
db.Previa = require("./Previa.model")(sequelize); //
db.TurnoExamen = require("./TurnoExamen.model")(sequelize); // ABRIL - JULIO - SEPTIEMBRE - DICIEMBRE - FEBRERO
db.FechaExamen = require("./FechaExamen.model")(sequelize);
db.Inscripcion = require("./Inscripcion.model")(sequelize); // Inscripcion de un alumno a un examen
db.Rol = require("./Rol.model")(sequelize);

// Asociaciones}
db.Usuario.belongsTo(db.Rol, {foreignKey: "id_rol",as: "Rol"});
db.Rol.hasMany(db.Usuario, {foreignKey: "id_rol", as: "Usuarios"});

db.Curso.hasMany(db.Previa, { foreignKey: "id_curso", as: "Previa"});
db.Previa.belongsTo(db.Curso, { foreignKey: "id_curso", as: "Curso"});

db.Materia.hasMany(db.Previa, { foreignKey: "id_materia", as: "Previa"});
db.Previa.belongsTo(db.Materia, { foreignKey: "id_materia", as: "Materia"});

db.CicloLectivo.hasMany(db.Previa, { foreignKey: "id_ciclo", as: "Previa"});
db.Previa.belongsTo(db.CicloLectivo, { foreignKey: "id_ciclo", as: "CicloLectivo"});

db.Condicion.hasMany(db.Previa, { foreignKey: "id_condicion", as: "Previa"});
db.Previa.belongsTo(db.Condicion, { foreignKey: "id_condicion", as: "Condicion"});

db.Plan.hasMany(db.Previa, { foreignKey: "id_plan", as: "Previa"});
db.Previa.belongsTo(db.Plan, { foreignKey: "id_plan", as: "Plan"});

db.Alumno.hasMany(db.Previa, { foreignKey: "id_alumno", as: "Previa"});
db.Previa.belongsTo(db.Alumno, { foreignKey: "id_alumno", as: "Alumno"});

// Exportamos el objeto db
module.exports = db;
