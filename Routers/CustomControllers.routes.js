// Importamos el módulo de enrutamiento de Express
const Rutas = require("express").Router();

// Importamos el controlador
const {
  generarResumenInscriptosPDF,
} = require("../Services/pdf/resumenInscriptosExamenes.js");

// Importamos el middleware de autenticación
const Auth = require("../Middlewares/Auth.js");

// Definimos una ruta POST para obtener el resumen
Rutas.post("/resumenInscriptosExamenes", Auth, generarResumenInscriptosPDF);

// Exportamos las rutas
module.exports = Rutas;
