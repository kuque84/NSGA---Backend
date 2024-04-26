const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Condicion = sequelize.define('Condicion', {
    id_condicion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
{
    tableName: 'condiciones',
});

  return Condicion;
};
