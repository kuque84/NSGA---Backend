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
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos', // nombre de la tabla referenciada
        key: 'id_curso'
      }
    },
    division: {
      type: DataTypes.STRING(1),
      allowNull: false,
      references: {
        model: 'divisiones', // nombre de la tabla referenciada
        key: 'division'
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
    id_ciclo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cicloLectivos', // nombre de la tabla referenciada
        key: 'id_ciclo'
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