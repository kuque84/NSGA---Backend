// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Materia usando sequelize.define
  const Materia = sequelize.define('Materia', {
    // El modelo Materia tiene un campo id_materia que es un número entero, es la clave primaria y se autoincrementa
    id_materia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Materia tiene un campo nombre que es una cadena de caracteres y no puede ser nulo
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // El modelo Materia tiene un campo area que es una cadena de caracteres y puede ser nulo
    area: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // El modelo Materia tiene un campo id_curso que es un número entero, no puede ser nulo y hace referencia a la tabla 'cursos'
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos', // nombre de la tabla referenciada
        key: 'id_curso'
      }
    },
  }, {
    // El nombre de la tabla en la base de datos es 'materias'
    tableName: 'materias',
  });

  // La función exportada retorna el modelo Materia
  return Materia;
};