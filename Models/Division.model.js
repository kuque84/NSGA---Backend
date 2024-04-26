const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Division = sequelize.define('Division', {
    division: {
      type: DataTypes.STRING(1),
      primaryKey: true,
    },
  },
  {
    tableName: 'divisiones',
  });

  return Division;
};
