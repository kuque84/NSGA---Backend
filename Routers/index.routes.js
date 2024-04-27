// Exportamos una función que toma la aplicación Express como argumento
module.exports = (app) => {
    // Importamos el middleware de autenticación
    const Auth = require('../Middlewares/Auth.js');

    // Importamos las rutas del usuario
    const UsuarioRoutes = require('./Usuario.routes.js');
    const CicloLectivoRoutes = require('./CicloLectivo.routes.js');
    const CursoRoutes = require('./Curso.routes.js');
    const PlanRoutes = require('./Plan.routes.js');
    const DivisionRoutes = require('./Division.routes.js');
    const MateriaRoutes = require('./Materia.routes.js');
    const CondicionRoutes = require('./Condicion.routes.js');
    const CalificacionRoutes = require('./Calificacion.routes.js');
    const AlumnoRoutes = require('./Alumno.routes.js');
    
    // Usamos el middleware de autenticación y las rutas del usuario para todas las solicitudes a '/usuario'
    app.use('/usuario', UsuarioRoutes);
    app.use('/ciclolectivo', CicloLectivoRoutes);
    app.use('/curso', CursoRoutes);
    app.use('/plan', PlanRoutes);
    app.use('/division', DivisionRoutes);
    app.use('/materia', MateriaRoutes);
    app.use('/condicion', CondicionRoutes);
    app.use('/calificacion', CalificacionRoutes);
    app.use('/alumno', AlumnoRoutes);
};
