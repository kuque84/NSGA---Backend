const PDFDocument = require('pdfkit');
const { addMembrete, addHeader, addTextWithMargins, MARGEN_TOP } = require('./pdfService');

const generateExamenActaPDF = (data, res) => {
  const doc = new PDFDocument({ size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=examen_acta.pdf');
  doc.pipe(res);

  addMembrete(doc);
  addHeader(doc, 'Acta de Examen');

  // Agrega contenido específico para el acta de examen
  addTextWithMargins(doc, `Fecha de Examen: ${data.fechaExamen}`, { y: MARGEN_TOP + 150 });
  data.examenes.forEach((examen, index) => {
    addTextWithMargins(
      doc,
      `Alumno ${index + 1}: ${examen.nombre} - Calificación: ${examen.calificacion}`,
      { y: MARGEN_TOP + 170 + index * 20 }
    );
  });

  doc.end();
};

module.exports = { generateExamenActaPDF };
