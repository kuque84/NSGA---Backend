// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de Materia
const MateriaController = require('../Controllers/Materia.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de Materias
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, MateriaController.lista);
//Rutas.get('/Materia', Auth, MateriaController.lista);

// Definimos una ruta GET para filtrar Materias por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, MateriaController.filtrar);

// Definimos una ruta POST para crear un nuevo Materia
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', Auth, MateriaController.nuevo);

// Definimos una ruta PUT para actualizar un Materia por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, MateriaController.actualizar);

// Definimos una ruta DELETE para eliminar un Materia por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, MateriaController.eliminar);

// Exportamos las rutas
module.exports = Rutas;