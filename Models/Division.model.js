// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Division usando sequelize.define
  const Division = sequelize.define('Division', {
    // El modelo Division tiene un campo id_division que es un número entero, es la clave primaria y se autoincrementa
    id_division: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Division tiene un campo nombre que es una cadena de hasta 1 caracter
    nombre: {
      type: DataTypes.STRING(1),
    },
    // El modelo Division tiene un campo id_curso que es un número entero, no puede ser nulo y hace referencia a la tabla 'cursos'
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos', // nombre de la tabla referenciada
        key: 'id_curso'
      }
    },
  },
  {
    // El nombre de la tabla en la base de datos es 'divisiones'
    tableName: 'divisiones',
  });

  // La función exportada retorna el modelo Division
  return Division;
};