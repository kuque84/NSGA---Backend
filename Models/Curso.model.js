// Importamos el objeto DataTypes de la biblioteca sequelize. 
const { DataTypes } = require('sequelize');

// Exportamos una función que toma una instancia de Sequelize y define un modelo en ella.
module.exports = (sequelize) => {

  // Definimos un nuevo modelo llamado 'Curso'. Los modelos en Sequelize representan tablas en la base de datos.
  const Curso = sequelize.define('Curso', {

    // Definimos el campo 'id_curso'. Este es el campo de clave primaria de la tabla.
    // Está configurado para autoincrementarse, lo que significa que cada vez que se crea una nueva fila, este campo se incrementará automáticamente a partir del último valor de 'id_curso'.
    id_curso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'planes', // nombre de la tabla referenciada
        key: 'id_plan'
      }
    },
    // Definimos el campo 'nombre'. Este es un campo de cadena que no puede ser nulo.
    nombre: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
  },{
    // Especificamos el nombre de la tabla en la base de datos.
    tableName: 'cursos',
  });

  // Devolvemos el modelo 'Curso' definido, permitiendo que sea utilizado en otras partes de nuestra aplicación.
  return Curso;
};