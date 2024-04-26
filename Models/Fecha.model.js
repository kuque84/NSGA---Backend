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
    id_materia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias', // nombre de la tabla referenciada
        key: 'id_materia'
      }
    },
    id_plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'planes', // nombre de la tabla referenciada
        key: 'id_plan'
      }
    },
    id_condicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'condiciones', // nombre de la tabla referenciada
        key: 'id_condicion'
      }
    },
  }, {
    tableName: 'fechas', // especificamos el nombre de la tabla
  });

  return Fecha;
};