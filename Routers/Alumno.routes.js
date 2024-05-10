// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Alumno
const AlumnoController = require('../Controllers/Alumno.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Alumnos
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, AlumnoController.lista);
//Rutas.get('/Alumno', Auth, AlumnoController.lista);

Rutas.get('/lista/:pag', AlumnoController.listaPag);
Rutas.get('/lista/:pag/:text', AlumnoController.listaPag);

// Definimos una ruta GET para filtrar Alumnos por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, AlumnoController.filtrar);

// Definimos una ruta POST para crear un nuevo Alumno
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, AlumnoController.nuevo);

// Definimos una ruta PUT para actualizar un Alumno por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, AlumnoController.actualizar);

// Definimos una ruta DELETE para eliminar un Alumno por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, AlumnoController.eliminar);

// Exportamos las rutas
module.exports = Rutas;