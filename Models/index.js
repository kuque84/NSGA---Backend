// Importamos Sequelize
const Sequelize = require('sequelize');

// Importamos la configuración de la base de datos
const dbConfig = require('../Config/db.config');

// Creamos una nueva instancia de Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(
  dbConfig.DB, // Nombre de la base de datos
  dbConfig.USER, // Usuario de la base de datos
  dbConfig.PASSWORD, // Contraseña de la base de datos
  {
    host: dbConfig.HOST, // Host de la base de datos
    dialect: dbConfig.dialect, // Dialecto de la base de datos (por ejemplo, 'mysql', 'postgres', 'sqlite')
    port: dbConfig.port, // Puerto de la base de datos
    pool: {
      max: dbConfig.pool.max, // Número máximo de conexiones en el grupo de conexiones
      min: dbConfig.pool.min, // Número mínimo de conexiones en el grupo de conexiones
      acquire: dbConfig.pool.acquire, // Tiempo máximo en milisegundos para adquirir una conexión antes de lanzar un error
      idle: dbConfig.pool.idle // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

// Creamos un objeto vacío para almacenar los modelos de la base de datos
const db = {};

// Asignamos Sequelize y la instancia de Sequelize al objeto db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos los modelos y los añadimos al objeto db

db.Usuario = require('./Usuario.model')(sequelize);// Usuario que realiza login
//VER ENCABEZADO Y PIE - QUIZÁS TABLA DE DATOS DE INSTITUCIÓN
db.CicloLectivo = require('./CicloLectivo.model')(sequelize);//
db.Plan = require('./Plan.model')(sequelize);//
db.Curso = require('./Curso.model')(sequelize);//
db.Division = require('./Division.model')(sequelize);//
db.Materia = require('./Materia.model')(sequelize);//
db.Condicion = require('./Condicion.model')(sequelize);// PREVIA - EQUIVALENCIA - TERCERA MATERIA - EXCEPTUADA - COLOQUIO
db.Calificacion = require('./Calificacion.model')(sequelize);// A - 1 a 10
db.Alumno = require('./Alumno.model')(sequelize);//
db.Previa = require('./Previa.model')(sequelize);//
db.TurnoExamen = require('./TurnoExamen.model')(sequelize);// ABRIL - JULIO - SEPTIEMBRE - DICIEMBRE - FEBRERO
db.FechaExamen = require('./FechaExamen.model')(sequelize);
db.Inscripcion = require('./Inscripcion.model')(sequelize);// Inscripcion de un alumno a un examen
db.Rol = require ('./Rol.model')(sequelize);

// Definimos las relaciones entre los modelos
//db.Alumno.belongsToMany(db.Curso, { through: db.Previa });
//db.Curso.belongsToMany(db.Alumno, { through: db.Previa });

// Exportamos el objeto db
module.exports = db;