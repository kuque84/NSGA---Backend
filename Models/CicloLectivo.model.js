// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
    // Definimos el modelo CicloLectivo usando sequelize.define
    const CicloLectivo = sequelize.define('CicloLectivo', 
    {
        // El campo id_ciclo, que es un entero, la clave primaria y se autoincrementa
        id_ciclo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // El campo anio, es un dato tipo fecha y no puede ser nulo y se trata de un año, ejemplo: 2021
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'cicloLectivos',
    }
);

    // Devolvemos el modelo CicloLectivo
    return CicloLectivo;
};