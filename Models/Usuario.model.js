// Importamos DataTypes de sequelize
const { DataTypes } = require("sequelize");

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
  // Definimos el modelo Usuario usando sequelize.define
  const Usuario = sequelize.define(
    "Usuario",
    {
      // El campo dni, que es una cadena de hasta 8 caracteres y puede ser nulo
      dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      // El campo nombre, que es una cadena de hasta 100 caracteres y no puede ser nulo
      nombres: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      apellidos: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // El campo email, que es una cadena de hasta 100 caracteres y no puede ser nulo
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // El campo password, que es una cadena de hasta 100 caracteres y puede ser nulo
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      // El nombre de la tabla en la base de datos es 'usuarios'
      tableName: "usuarios",
    }
  );
  // Devolvemos el modelo Usuario
  return Usuario;
};
