const Rutas = require("express").Router();
const { generateRACActaPDF } = require("../Services/pdf/racActaService.js");
const { generateExamenActaPDF } = require("../Services/pdf/examenActaService");
const {
  generatePermisoExamenPDF,
} = require("../Services/pdf/permisoExamenService");
const Auth = require("../Middlewares/Auth.js");
const InscripcionController = require("../Controllers/Inscripcion.controller.js");

// Ruta para generar el Acta de RAC
Rutas.get("/rac/pdf", Auth, async (req, res) => {
  const { id_alumno, id_ciclo } = req.query;
  try {
    const data = { id_alumno, id_ciclo };
    await generateRACActaPDF(data, res);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
});

// Ruta para generar el Acta de Examen en PDF
Rutas.get(
  "/examen/pdf/:id_turno/:id_condicion/:id_materia",
  Auth,
  (req, res, next) => {
    req.query.generatePDF = true; // Añadir el parámetro generatePDF
    next();
  },
  InscripcionController.filtrarActa,
  async (req, res) => {
    try {
      const data = req.data;
      // Generar el PDF con los datos obtenidos
      await generateExamenActaPDF(data, res);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).send("Error al generar el PDF");
    }
  }
);

Rutas.get(
  "/Coloquio/pdf/:id_ciclo/:id_curso/:id_division/:id_turno/:id_condicion/:id_materia",
  Auth,
  (req, res, next) => {
    req.query.generatePDF = true; // Añadir el parámetro generatePDF
    next();
  },
  InscripcionController.filtrarActaColoquio,
  async (req, res) => {
    try {
      const data = req.data;
      console.log("data:", data.Curso);
      // Generar el PDF con los datos obtenidos
      await generateExamenActaPDF(data, res);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).send("Error al generar el PDF");
    }
  }
);

// Ruta para generar el Permiso de Examen
// Rutas.get("/permiso/pdf/:id_alumno/:id_turno", Auth, async (req, res) => {
Rutas.get(
  "/permiso/pdf/:id_alumno/:id_turno",
  (req, res, next) => {
    req.query.generatePDF = true; // Añadir el parámetro generatePDF
    next();
  },
  InscripcionController.filtrarPermisoExamen,
  async (req, res) => {
    try {
      const data = req.data;
      console.log("data:", data);
      // Generar el PDF con los datos obtenidos
      await generatePermisoExamenPDF(data, res);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).send("Error al generar el PDF");
    }
  }
);

module.exports = Rutas;
