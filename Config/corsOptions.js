module.exports = {
    origin: process.env.CORS_ORIGIN || '*', 
    methods: 'GET,PUT,POST,DELETE', 
    allowedHeaders: '*', 
    optionsSuccessStatus: 200,
};
/*
module.exports = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Cambia esto por el dominio de tu aplicación en producción
    methods: 'GET,POST', // Cambia esto por los métodos que tu aplicación realmente utiliza
    allowedHeaders: 'Content-Type,Authorization', // Cambia esto por las cabeceras que tu aplicación realmente necesita
    optionsSuccessStatus: 200,
};
*/