// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
    // Definimos el modelo Usuario usando sequelize.define
    const Usuario = sequelize.define('Usuario', 
    {
        // El campo nombre, que es una cadena de hasta 100 caracteres y no puede ser nulo
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        // El campo email, que es una cadena de hasta 100 caracteres y no puede ser nulo
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        // El campo dni, que es una cadena de hasta 8 caracteres y puede ser nulo
        dni: {
            type: DataTypes.STRING(8),
            allowNull: true,
        },
        // El campo password, que es una cadena de hasta 100 caracteres y puede ser nulo
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    },{
        tableName: 'usuarios',
    });
    // Devolvemos el modelo Usuario
    return Usuario;
};