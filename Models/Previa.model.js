const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Previa = sequelize.define('Previa', {
    id_previa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dni_alumno: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: 'alumnos', // nombre de la tabla referenciada
        key: 'dni'
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
    id_materia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias', // nombre de la tabla referenciada
        key: 'id_materia'
      }
    },
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'previas', // especificamos el nombre de la tabla
  });

  return Previa;
};