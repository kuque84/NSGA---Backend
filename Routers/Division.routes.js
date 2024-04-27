// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Division
const DivisionController = require('../Controllers/Division.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Divisions
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, DivisionController.lista);
//Rutas.get('/Division', Auth, DivisionController.lista);

// Definimos una ruta GET para filtrar Divisions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, DivisionController.filtrar);

// Definimos una ruta POST para crear un nuevo Division
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, DivisionController.nuevo);

// Definimos una ruta PUT para actualizar un Division por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, DivisionController.actualizar);

// Definimos una ruta DELETE para eliminar un Division por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, DivisionController.eliminar);

// Exportamos las rutas
module.exports = Rutas;