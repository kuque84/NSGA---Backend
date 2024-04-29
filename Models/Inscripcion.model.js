const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inscripcion = sequelize.define('Inscripcion', {
    id_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_previa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'previas', // nombre de la tabla referenciada
        key: 'id_previa'
      }
    },
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnosExamen', // nombre de la tabla referenciada
        key: 'id_turno'
      }
    },
    id_fechaExamen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fechasExamen', // nombre de la tabla referenciada
        key: 'id_fechaExamen'
      }
    },
    id_calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'calificaciones', // nombre de la tabla referenciada
        key: 'id_calificacion'
      }
    },
    libro: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    folio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'inscripciones', // especificamos el nombre de la tabla
  });

  return Inscripcion;
};