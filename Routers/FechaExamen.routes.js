// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de FechaExamen
const FechaExamenController = require('../Controllers/FechaExamen.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de FechaExamens
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, FechaExamenController.lista);
//Rutas.get('/FechaExamen', Auth, FechaExamenController.lista);

// Definimos una ruta GET para filtrar FechaExamens por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, FechaExamenController.filtrar);
Rutas.get(
  '/filtrar/inscripcion/:id_turno/:id_materia/:id_condicion',
  Auth,
  FechaExamenController.filtrarPorInscripcion
);

// Definimos una ruta POST para crear un nuevo FechaExamen
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, FechaExamenController.nuevo);

// Definimos una ruta PUT para actualizar un FechaExamen por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, FechaExamenController.actualizar);

// Definimos una ruta DELETE para eliminar un FechaExamen por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, FechaExamenController.eliminar);

// Exportamos las rutas
module.exports = Rutas;
