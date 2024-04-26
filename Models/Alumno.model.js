const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alumno = sequelize.define('Alumno', {
    dni: {
      type: DataTypes.STRING(12),
      primaryKey: true,
    },
    apellidos: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },{
    tableName: 'alumnos',
  });

  return Alumno;
};
