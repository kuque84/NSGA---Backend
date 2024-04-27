// Exportamos una función que toma la aplicación Express como argumento
module.exports = (app) => {
    // Importamos el middleware de autenticación
    const Auth = require('../Middlewares/Auth.js');

    // Importamos las rutas del usuario
    const UsuarioRoutes = require('./Usuario.routes.js');
    const CicloLectivoRoutes = require('./CicloLectivo.routes.js');
    
    // Usamos el middleware de autenticación y las rutas del usuario para todas las solicitudes a '/usuario'
    app.use('/usuario', UsuarioRoutes);
    app.use('/ciclolectivo', CicloLectivoRoutes);
};
