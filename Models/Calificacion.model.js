// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Calificacion usando sequelize.define
  const Calificacion = sequelize.define('Calificacion', {
    // El modelo Calificacion tiene un campo id_calificacion que es un número entero, es la clave primaria y se autoincrementa
    id_calificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Calificacion tiene un campo calificacion que es una cadena de hasta 4 caracteres y no puede ser nulo
    calificacion: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    // El modelo Calificacion tiene un campo aprobado que es un valor booleano y no puede ser nulo
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // El nombre de la tabla en la base de datos es 'calificaciones'
    tableName: 'calificaciones',
  }
);

  // La función exportada retorna el modelo Calificacion
  return Calificacion;
};