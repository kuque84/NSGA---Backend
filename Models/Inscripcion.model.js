// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Inscripcion usando sequelize.define
  const Inscripcion = sequelize.define('Inscripcion', {
    // El modelo Inscripcion tiene un campo id_inscripcion que es un número entero, es la clave primaria y se autoincrementa
    id_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Inscripcion tiene un campo id_previa que es un número entero, no puede ser nulo y hace referencia a la tabla 'previas'
    id_previa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'previas', // nombre de la tabla referenciada
        key: 'id_previa'
      }
    },
    // El modelo Inscripcion tiene un campo id_turno que es un número entero, no puede ser nulo y hace referencia a la tabla 'turnosExamen'
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnosExamen', // nombre de la tabla referenciada
        key: 'id_turno'
      }
    },
    // El modelo Inscripcion tiene un campo id_fechaExamen que es un número entero, no puede ser nulo y hace referencia a la tabla 'fechasExamen'
    id_fechaExamen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fechasExamen', // nombre de la tabla referenciada
        key: 'id_fechaExamen'
      }
    },
    // El modelo Inscripcion tiene un campo id_calificacion que es un número entero, no puede ser nulo y hace referencia a la tabla 'calificaciones'
    id_calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'calificaciones', // nombre de la tabla referenciada
        key: 'id_calificacion'
      }
    },
    // El modelo Inscripcion tiene un campo libro que es una cadena de caracteres y puede ser nulo
    libro: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // El modelo Inscripcion tiene un campo folio que es una cadena de caracteres y puede ser nulo
    folio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    // El nombre de la tabla en la base de datos es 'inscripciones'
    tableName: 'inscripciones',
    indexes: [
      {
        unique: true,
        fields: ['id_previa', 'id_turno']
      }
    ]
  });

  // La función exportada retorna el modelo Inscripcion
  return Inscripcion;
};