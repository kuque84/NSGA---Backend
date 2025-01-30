const Rutas = require('express').Router();
const InscripcionCursoController = require('../Controllers/InscripcionCurso.controller.js');
const Auth = require('../Middlewares/Auth.js');

Rutas.get('/lista', Auth, InscripcionCursoController.lista);
Rutas.get('/filtrar/:campo/:valor', Auth, InscripcionCursoController.filtrar);
Rutas.post('/nuevo', Auth, InscripcionCursoController.nuevo);
Rutas.put('/actualizar/:id', Auth, InscripcionCursoController.actualizar);
Rutas.delete('/eliminar/:id', Auth, InscripcionCursoController.eliminar);
Rutas.get('/cursos/:id_ciclo', Auth, InscripcionCursoController.cursoPorCiclo);
Rutas.get(
  '/alumnosporcurso/:id_ciclo/:id_curso/:id_division',
  Auth,
  InscripcionCursoController.alumnosPorCurso
);

module.exports = Rutas;
