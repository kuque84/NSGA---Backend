// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Plan usando sequelize.define
  const Plan = sequelize.define('Plan', {
    // El campo id_plan, que es un entero, la clave primaria y se autoincrementa
    id_plan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // El campo codigo, que es una cadena de hasta 25 caracteres y no puede ser nulo
    codigo: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    // El campo descripcion, que es una cadena de hasta 255 caracteres y no puede ser nulo
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // El campo id_ciclo, que es una referencia a la tabla CicloLectivo
  },
  {
    tableName: 'planes',
  }
);
  // Devolvemos el modelo Plan
  return Plan;
};