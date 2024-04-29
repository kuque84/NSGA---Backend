const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FechaExamen = sequelize.define('FechaExamen', {
    id_fechaExamen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaExamen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnosExamen', // nombre de la tabla referenciada
        key: 'id_turno'
      }
    },
    id_materia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias', // nombre de la tabla referenciada
        key: 'id_materia'
      }
    },
  }, {
    tableName: 'fechasExamen', // especificamos el nombre de la tabla
  });

  return FechaExamen;
};