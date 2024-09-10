const PDFDocument = require('pdfkit');
const { addMembrete, addHeader } = require('./pdfService');

const generateExamenActaPDF = (data, res) => {
    const doc = new PDFDocument({ size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=examen_acta.pdf');
    doc.pipe(res);

    addMembrete(doc);
    addHeader(doc, 'Acta de Examen');
    
    // Agrega contenido específico para el acta de examen
    doc.text(`Fecha de Examen: ${data.fechaExamen}`, { align: 'left' });
    data.examenes.forEach((examen, index) => {
        doc.text(`Alumno ${index + 1}: ${examen.nombre} - Calificación: ${examen.calificacion}`, { align: 'left' });
    });
    
    doc.end();
};

module.exports = { generateExamenActaPDF };
