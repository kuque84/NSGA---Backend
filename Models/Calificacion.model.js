const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Calificacion = sequelize.define('Calificacion', {
    id_calificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    calificacion: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'calificaciones',
  }
);

  return Calificacion;
};
