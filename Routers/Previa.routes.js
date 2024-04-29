// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Previa
const PreviaController = require('../Controllers/Previa.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Previas
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, PreviaController.lista);
//Rutas.get('/Previa', Auth, PreviaController.lista);

// Definimos una ruta GET para filtrar Previas por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, PreviaController.filtrar);

// Definimos una ruta POST para crear un nuevo Previa
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, PreviaController.nuevo);

// Definimos una ruta PUT para actualizar un Previa por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, PreviaController.actualizar);

// Definimos una ruta DELETE para eliminar un Previa por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, PreviaController.eliminar);

// Exportamos las rutas
module.exports = Rutas;