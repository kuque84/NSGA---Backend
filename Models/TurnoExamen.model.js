// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo TurnoExamen usando sequelize.define
  const TurnoExamen = sequelize.define('TurnoExamen', {
    // El modelo TurnoExamen tiene un campo id_turno que es un número entero, es la clave primaria y se autoincrementa
    id_turno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo TurnoExamen tiene un campo nombre que es una cadena de caracteres y no puede ser nulo
    nombre: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    // El modelo TurnoExamen tiene un campo id_condicion que es un número entero, no puede ser nulo y hace referencia a la tabla 'condiciones'
    // id_condicion: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'condiciones', // nombre de la tabla referenciada
    //     key: 'id_condicion'
    //   }
    // },
    // El modelo TurnoExamen tiene un campo id_ciclo que es un número entero, no puede ser nulo y hace referencia a la tabla 'cicloLectivos'

    id_ciclo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cicloLectivos', // nombre de la tabla referenciada
        key: 'id_ciclo'
      }
    },
  }, {
    // El nombre de la tabla en la base de datos es 'turnosExamen'
    tableName: 'turnosExamen',
    indexes: [
      {
        unique: true,
        //fields: ['id_condicion', 'id_ciclo', 'nombre']
        fields: ['id_ciclo', 'nombre']
      }
    ]
  });

  // La función exportada retorna el modelo TurnoExamen
  return TurnoExamen;
};