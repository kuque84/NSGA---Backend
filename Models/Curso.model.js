// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Curso usando sequelize.define
  const Curso = sequelize.define('Curso', {
    // El modelo Curso tiene un campo id_curso que es un número entero, es la clave primaria y se autoincrementa
    id_curso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El modelo Curso tiene un campo id_plan que es un número entero, no puede ser nulo y hace referencia a la tabla 'planes'
    id_plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'planes', // nombre de la tabla referenciada
        key: 'id_plan'
      }
    },
    // El modelo Curso tiene un campo nombre que es una cadena de hasta 2 caracteres y no puede ser nulo
    nombre: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
  },{
    // El nombre de la tabla en la base de datos es 'cursos'
    tableName: 'cursos',
  });

  // La función exportada retorna el modelo Curso
  return Curso;
};