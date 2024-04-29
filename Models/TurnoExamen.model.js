const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TurnoExamen = sequelize.define('TurnoExamen', {
    id_turno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    id_condicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'condiciones', // nombre de la tabla referenciada
        key: 'id_condicion'
      }
    },
    id_ciclo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cicloLectivos', // nombre de la tabla referenciada
        key: 'id_ciclo'
      }
    },
  },{
    tableName: 'turnosExamen',
  });

  return TurnoExamen;
};
