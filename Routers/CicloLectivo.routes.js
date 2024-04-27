// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de CicloLectivo
const CicloLectivoController = require('../Controllers/CicloLectivo.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de CicloLectivos
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, CicloLectivoController.lista);
//Rutas.get('/ciclolectivo', Auth, CicloLectivoController.lista);

// Definimos una ruta GET para filtrar CicloLectivos por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, CicloLectivoController.filtrar);

// Definimos una ruta POST para crear un nuevo CicloLectivo
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, CicloLectivoController.nuevo);

// Definimos una ruta PUT para actualizar un CicloLectivo por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, CicloLectivoController.actualizar);

// Definimos una ruta DELETE para eliminar un CicloLectivo por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, CicloLectivoController.eliminar);

// Exportamos las rutas
module.exports = Rutas;