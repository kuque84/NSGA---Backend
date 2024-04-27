// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Calificacion
const CalificacionController = require('../Controllers/Calificacion.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Calificacions
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, CalificacionController.lista);
//Rutas.get('/Calificacion', Auth, CalificacionController.lista);

// Definimos una ruta GET para filtrar Calificacions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, CalificacionController.filtrar);

// Definimos una ruta POST para crear un nuevo Calificacion
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, CalificacionController.nuevo);

// Definimos una ruta PUT para actualizar un Calificacion por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, CalificacionController.actualizar);

// Definimos una ruta DELETE para eliminar un Calificacion por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, CalificacionController.eliminar);

// Exportamos las rutas
module.exports = Rutas;