const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TurnoExamen = sequelize.define('TurnoExamen', {
    id_turno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },{
    tableName: 'turnosExamen',
  });

  return TurnoExamen;
};
