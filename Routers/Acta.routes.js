const Rutas = require('express').Router();
const { generateRACActaPDF } = require('../Services/pdf/racActaService.js');
const { generateExamenActaPDF } = require('../Services/pdf/examenActaService');
const { generatePermisoExamenPDF } = require('../Services/pdf/permisoExamenService');
const Auth = require('../Middlewares/Auth.js');

// Ruta para generar el Acta de RAC
Rutas.get('/rac/pdf', async (req, res) => {
  const { id_alumno, id_ciclo } = req.query;
  try {
    const data = { id_alumno, id_ciclo };
    await generateRACActaPDF(data, res);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

// Ruta para generar el Acta de Examen
Rutas.get('/examen/pdf', Auth, (req, res) => {
  const data = {
    fechaExamen: '2024-09-10',
    examenes: [
      { nombre: 'Juan Pérez', calificacion: 'Aprobado' },
      { nombre: 'María López', calificacion: 'Desaprobado' },
    ],
  };
  generateExamenActaPDF(data, res);
});

// Ruta para generar el Permiso de Examen
Rutas.get('/permiso/pdf', Auth, (req, res) => {
  const data = {
    alumno: 'Juan Pérez',
    materia: 'Matemáticas',
    turno: 'Mañana',
  };
  generatePermisoExamenPDF(data, res);
});

module.exports = Rutas;
