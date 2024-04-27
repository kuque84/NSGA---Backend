const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fecha = sequelize.define('Fecha', {
    id_fecha: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
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
  }, {
    tableName: 'fechas', // especificamos el nombre de la tabla
  });

  return Fecha;
};