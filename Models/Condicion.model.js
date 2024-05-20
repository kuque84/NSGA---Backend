// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Condicion usando sequelize.define
  const Condicion = sequelize.define('Condicion', {
    // El modelo Condicion tiene un campo id_condicion que es un número entero, es la clave primaria y se autoincrementa
    id_condicion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Condicion tiene un campo nombre que es una cadena de hasta 255 caracteres y no puede ser nulo
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    // El nombre de la tabla en la base de datos es 'condiciones'
    tableName: 'condiciones',
  });

  // La función exportada retorna el modelo Condicion
  return Condicion;
};