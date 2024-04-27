// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Condicion
const CondicionController = require('../Controllers/Condicion.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Condicions
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, CondicionController.lista);
//Rutas.get('/Condicion', Auth, CondicionController.lista);

// Definimos una ruta GET para filtrar Condicions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, CondicionController.filtrar);

// Definimos una ruta POST para crear un nuevo Condicion
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, CondicionController.nuevo);

// Definimos una ruta PUT para actualizar un Condicion por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, CondicionController.actualizar);

// Definimos una ruta DELETE para eliminar un Condicion por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, CondicionController.eliminar);

// Exportamos las rutas
module.exports = Rutas;