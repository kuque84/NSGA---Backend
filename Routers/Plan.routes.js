// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Plan
const PlanController = require('../Controllers/Plan.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Planes
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, PlanController.lista);
//Rutas.get('/Plan', Auth, PlanController.lista);

// Definimos una ruta GET para filtrar Planes por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, PlanController.filtrar);

// Definimos una ruta POST para crear un nuevo Plan
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, PlanController.nuevo);

// Definimos una ruta PUT para actualizar un Plan por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, PlanController.actualizar);

// Definimos una ruta DELETE para eliminar un Plan por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, PlanController.eliminar);

// Exportamos las rutas
module.exports = Rutas;