// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Inscripcion
const InscripcionController = require('../Controllers/Inscripcion.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Inscripcions
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, InscripcionController.lista);
//Rutas.get('/Inscripcion', Auth, InscripcionController.lista);

// Definimos una ruta GET para filtrar Inscripcions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, InscripcionController.filtrar);

// Definimos una ruta POST para crear un nuevo Inscripcion
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, InscripcionController.nuevo);

// Definimos una ruta PUT para actualizar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, InscripcionController.actualizar);

// Definimos una ruta DELETE para eliminar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, InscripcionController.eliminar);

// Exportamos las rutas
module.exports = Rutas;