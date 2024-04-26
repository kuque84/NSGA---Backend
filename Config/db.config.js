module.exports = {
    // El host de la base de datos
    HOST: "localhost",

    // El usuario de la base de datos
    USER: "root",

    // La contraseña del usuario de la base de datos
    PASSWORD: "8484",

    // El nombre de la base de datos
    DB: "nsgaDb",

    // El dialecto de la base de datos (en este caso, MySQL)
    dialect: "mysql",

    // El puerto en el que se ejecuta la base de datos
    port: '3306',

    // Configuración del pool de conexiones a la base de datos
    pool: {
        // Número máximo de conexiones en el pool
        max: 5,

        // Número mínimo de conexiones en el pool
        min: 0,

        // Tiempo máximo, en milisegundos, que una conexión puede ser utilizada antes de ser liberada
        acquire: 30000,

        // Tiempo máximo, en milisegundos, que una conexión puede estar ociosa antes de ser liberada
        idle: 10000
    }
};