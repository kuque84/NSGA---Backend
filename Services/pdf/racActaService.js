const PDFDocument = require('pdfkit');
const {
  addMembrete,
  addHeader,
  addTextWithMargins,
  MARGEN_TOP, // Exportar constantes
  MARGEN_LEFT,
  MARGEN_RIGHT,
  MARGEN_BOTTOM,
} = require('./pdfService');

const generateRACActaPDF = (data, res) => {
  const doc = new PDFDocument({ size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=rac_acta.pdf');
  doc.pipe(res);

  doc.on('error', (err) => {
    console.error('Error en PDF:', err);
    res.status(500).send('Error al generar el PDF');
  });

  try {
    addMembrete(doc);
    addHeader(doc, 'Acta de RAC');
    addTextWithMargins(doc, `Contenido específico para RAC: ${data.detalles}`, {
      y: MARGEN_TOP + 100,
    });

    doc.end();
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    res.status(500).send('Error al procesar el PDF');
  }
};

module.exports = { generateRACActaPDF };
