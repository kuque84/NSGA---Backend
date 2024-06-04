// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Alumno usando sequelize.define
  const Alumno = sequelize.define('Alumno', {
    id_alumno: {
      type: DataTypes.INTEGER (),
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Alumno tiene un campo dni que es una cadena de hasta 12 caracteres y es la clave primaria
    dni: {
      type: DataTypes.STRING(12),
      unique: true,
    },
    // El modelo Alumno tiene un campo apellidos que es una cadena de hasta 255 caracteres y no puede ser nulo
    apellidos: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // El modelo Alumno tiene un campo nombres que es una cadena de hasta 255 caracteres y no puede ser nulo
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },{
    // El nombre de la tabla en la base de datos es 'alumnos'
    tableName: 'alumnos',
  });

  // La función exportada retorna el modelo Alumno
  return Alumno;
};