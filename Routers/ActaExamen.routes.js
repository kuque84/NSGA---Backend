// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Inscripcion
const ActaExamenController = require('../Controllers/ActaExamen.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Inscripcions
// Esta ruta requiere autenticación
Rutas.get('/actaexamen', Auth, ActaExamenController.lista);
//Rutas.get('/Inscripcion', Auth, InscripcionController.lista);

// Definimos una ruta GET para filtrar Inscripcions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, ActaExamenController.filtrar);

Rutas.get('/ciclo', Auth, ActaExamenController.getCicloByTurno);

Rutas.get('/turno/id_ciclo/:id_ciclo', Auth, ActaExamenController.getTurnosByCiclo);
Rutas.get(
  '/condicion/:id_ciclo/:id_turno',
  Auth,
  ActaExamenController.getCondicionesByCicloAndTurno
);
Rutas.get(
  '/curso/:id_ciclo/:id_turno/:id_condicion',
  Auth,
  ActaExamenController.getCursosByCicloTurnoAndCondicion
);
Rutas.get(
  '/materia/:id_ciclo/:id_turno/:id_condicion/:id_curso',
  Auth,
  ActaExamenController.getMateriasByCicloTurnoCondicionAndCurso
);

/*
// Definimos una ruta PUT para actualizar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, ActaExamenController.actualizar);
Rutas.put('/acta', Auth, ActaExamenController.actualizarActa);

// Definimos una ruta DELETE para eliminar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, ActaExamenController.eliminar);
*/

// Exportamos las rutas
module.exports = Rutas;
