// Importamos DataTypes de sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que toma sequelize como argumento
module.exports = (sequelize) => {
    // Definimos el modelo CicloLectivo usando sequelize.define
    const CicloLectivo = sequelize.define('CicloLectivo', 
    {
        // El modelo CicloLectivo tiene un campo id_ciclo que es un número entero, es la clave primaria y se autoincrementa
        id_ciclo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // El modelo CicloLectivo tiene un campo anio que es un número entero y no puede ser nulo
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        // El nombre de la tabla en la base de datos es 'cicloLectivos'
        tableName: 'cicloLectivos',
    }
);

    // La función exportada retorna el modelo CicloLectivo
    return CicloLectivo;
};