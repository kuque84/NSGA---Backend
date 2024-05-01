require('dotenv').config();

//console.log(process.env); // Imprime todas las variables de entorno

const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    PORT: process.env.DB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

console.log(dbConfig); // Imprime la configuración de la base de datos

module.exports = dbConfig;