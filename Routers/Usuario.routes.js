// Importamos el módulo de enrutamiento de Express
const Rutas = require('express').Router();

// Importamos el controlador de usuario
const UsuarioController = require('../Controllers/Usuario.controller.js');

// Importamos el middleware de autenticación
const Auth = require('../Middlewares/Auth.js');

// Definimos una ruta GET para obtener la lista de usuarios
// Esta ruta requiere autenticación
Rutas.get('/lista', Auth, UsuarioController.lista);

// Definimos una ruta GET para filtrar usuarios por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get('/filtrar/:campo/:valor', Auth, UsuarioController.filtrar);

// Definimos una ruta POST para crear un nuevo usuario
// Esta ruta no requiere autenticación
Rutas.post('/nuevo', UsuarioController.nuevo);

// Definimos una ruta POST para iniciar sesión
// Esta ruta no requiere autenticación
Rutas.post('/login', UsuarioController.login);

// Definimos una ruta PUT para actualizar un usuario por su ID
// Esta ruta requiere autenticación
Rutas.put('/actualizar/:id', Auth, UsuarioController.actualizar);

// Definimos una ruta DELETE para eliminar un usuario por su ID
// Esta ruta requiere autenticación
Rutas.delete('/eliminar/:id', Auth, UsuarioController.eliminar);

Rutas.post('/verificar', UsuarioController.verificar);

// Exportamos las rutas
module.exports = Rutas;