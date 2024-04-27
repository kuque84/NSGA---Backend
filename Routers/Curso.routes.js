// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Curso
const CursoController = require('../Controllers/Curso.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Cursos
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, CursoController.lista);
//Rutas.get('/Curso', Auth, CursoController.lista);

// Definimos una ruta GET para filtrar Cursos por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, CursoController.filtrar);

// Definimos una ruta POST para crear un nuevo Curso
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, CursoController.nuevo);

// Definimos una ruta PUT para actualizar un Curso por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, CursoController.actualizar);

// Definimos una ruta DELETE para eliminar un Curso por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, CursoController.eliminar);

// Exportamos las rutas
module.exports = Rutas;