const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Division = sequelize.define('Division', {
    division: {
      type: DataTypes.STRING(1),
      primaryKey: true,
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
