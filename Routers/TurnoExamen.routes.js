// Importamos el módulo de enrutamiento de Express
const Rutas = require("express").Router();

// Importamos el controlador de TurnoExamen
const TurnoExamenController = require("../Controllers/TurnoExamen.controller.js");

// Importamos el middleware de autenticación
const Auth = require("../Middlewares/Auth.js");

// Definimos una ruta GET para obtener la lista de TurnoExamens
// Esta ruta requiere autenticación
Rutas.get("/lista", Auth, TurnoExamenController.lista);
//Rutas.get('/TurnoExamen', Auth, TurnoExamenController.lista);

Rutas.get("/lista/:pag", Auth, TurnoExamenController.listaPag);
Rutas.get("/lista/:pag/:text", Auth, TurnoExamenController.listaPag);

// Definimos una ruta GET para filtrar TurnoExamens por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get("/filtrar/:campo/:valor", Auth, TurnoExamenController.filtrar);

// Definimos una ruta POST para crear un nuevo TurnoExamen
// Esta ruta no requiere autenticación
Rutas.post("/nuevo", Auth, TurnoExamenController.nuevo);

// Definimos una ruta PUT para actualizar un TurnoExamen por su ID
// Esta ruta requiere autenticación
Rutas.put("/actualizar/:id", Auth, TurnoExamenController.actualizar);

// Definimos una ruta DELETE para eliminar un TurnoExamen por su ID
// Esta ruta requiere autenticación
Rutas.delete("/eliminar/:id", Auth, TurnoExamenController.eliminar);

// Exportamos las rutas
module.exports = Rutas;
