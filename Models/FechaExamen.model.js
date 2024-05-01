// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo FechaExamen usando sequelize.define
  const FechaExamen = sequelize.define('FechaExamen', {
    // El modelo FechaExamen tiene un campo id_fechaExamen que es un número entero, es la clave primaria y se autoincrementa
    id_fechaExamen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo FechaExamen tiene un campo fechaExamen que es una fecha y no puede ser nulo
    fechaExamen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // El modelo FechaExamen tiene un campo id_turno que es un número entero, no puede ser nulo y hace referencia a la tabla 'turnosExamen'
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnosExamen', // nombre de la tabla referenciada
        key: 'id_turno'
      }
    },
    // El modelo FechaExamen tiene un campo id_materia que es un número entero, no puede ser nulo y hace referencia a la tabla 'materias'
    id_materia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias', // nombre de la tabla referenciada
        key: 'id_materia'
      }
    },
  }, {
    // El nombre de la tabla en la base de datos es 'fechasExamen'
    tableName: 'fechasExamen',
  });

  // La función exportada retorna el modelo FechaExamen
  return FechaExamen;
};