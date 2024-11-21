// Importamos los módulos necesarios
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./Middlewares/errorHandler');
const corsOptions = require('./Config/corsOptions'); // Importamos la configuración de CORS desde un archivo separado
const logger = require('./Config/logger'); // Importamos el logger

// Cargamos las variables de entorno
const envConfig = dotenv.config();

if (envConfig.error) {
  logger.error('Error al cargar las variables de entorno: ', envConfig.error);
  process.exit(1);
}

const port = envConfig.parsed.PORT;

// Usamos el middleware de express para parsear el cuerpo de las solicitudes a JSON
app.use(express.json());

// Usamos el middleware de CORS con las opciones definidas
app.use(cors(corsOptions));

// Importamos el modelo de la base de datos
const db = require('./Models');

// Importamos las rutas y las ejecutamos
require('./Routers/index.routes')(app);

// Usamos el middleware de manejo de errores
app.use(errorHandler);

// Sincronizamos la base de datos
const syncDatabase = async () => {
  try {
    const result = await db.sequelize.sync(); // {alter:true}
    logger.info(`Base de Datos conectada: ${result}`);
  } catch (err) {
    logger.error('Error: ', err);
    server.close(() => {
      process.exit(1);
    });
  }
};

syncDatabase();

// Iniciamos el servidor
let server;
const startServer = () => {
  server = app.listen(port, () => {
    logger.info(`Se inicializó el servidor en el puerto: ${port}`);
  });

  server.on('error', (err) => {
    logger.error('Error al iniciar el servidor: ', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
