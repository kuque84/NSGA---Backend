// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Previa usando sequelize.define
  const Previa = sequelize.define('Previa', {
    // El modelo Previa tiene un campo id_previa que es un número entero, es la clave primaria y se autoincrementa
    id_previa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Previa tiene un campo dni_alumno que es una cadena de caracteres, no puede ser nulo y hace referencia a la tabla 'alumnos'
    dni_alumno: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: 'alumnos', // nombre de la tabla referenciada
        key: 'dni'
      }
    },
    // El modelo Previa tiene un campo id_condicion que es un número entero, no puede ser nulo y hace referencia a la tabla 'condiciones'
    id_condicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'condiciones', // nombre de la tabla referenciada
        key: 'id_condicion'
      }
    },
    // El modelo Previa tiene un campo id_materia que es un número entero, no puede ser nulo y hace referencia a la tabla 'materias'
    id_materia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias', // nombre de la tabla referenciada
        key: 'id_materia'
      }
    },
    // El modelo Previa tiene un campo aprobado que es un booleano y no puede ser nulo
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    // El nombre de la tabla en la base de datos es 'previas'
    tableName: 'previas',
  });

  // La función exportada retorna el modelo Previa
  return Previa;
};