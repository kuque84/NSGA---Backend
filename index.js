// Importamos los módulos necesarios
const express = require('express');
const app = express();
const port = require('./Config/env').port || 3000; // Definimos el puerto
const cors = require('cors');

// Usamos el middleware de express para parsear el cuerpo de las solicitudes a JSON
app.use(express.json());

// Definimos las opciones de CORS
const corsOptions = {
    origin: '*', // Permitimos cualquier origen
    methods: 'GET,PUT,POST,DELETE', // Permitimos estos métodos
    allowedHeaders: '*', // Permitimos cualquier cabecera
    optionsSuccessStatus: 200, // El código de estado que se devuelve cuando una solicitud de pre-vuelo tiene éxito
};

// Usamos el middleware de CORS con las opciones definidas
app.use(cors(corsOptions));

// Importamos el modelo de la base de datos
const db = require('./Models');

// Importamos las rutas y las ejecutamos
require('./Routers/index.routes')(app); 

// Sincronizamos la base de datos
db.sequelize
    .sync({alter:true}) // {alter/force:true} (alter:actualizar // force: regenera)
    .then((result) => {
        console.log(`Database connected ${result}`); // Si todo va bien, mostramos este mensaje
    })
    .catch((err) => {
        console.log('Error: ', err); // Si hay un error, lo mostramos
    });

// Iniciamos el servidor
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Mostramos el puerto en el que se está ejecutando el servidor
});