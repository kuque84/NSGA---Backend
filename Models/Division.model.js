const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Division = sequelize.define('Division', {
    id_division: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(1),
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos', // nombre de la tabla referenciada
        key: 'id_curso'
      }
    },
  },
  {
    tableName: 'divisiones',
  });

  return Division;
};
