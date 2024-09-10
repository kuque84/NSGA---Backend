const PDFDocument = require('pdfkit');

const { addMembrete, addHeader } = require('./pdfService');

const generatePermisoExamenPDF = (data, res) => {
    const doc = new PDFDocument({ size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=permiso_examen.pdf');
    doc.pipe(res);

    addMembrete(doc);
    addHeader(doc, 'Permiso de Examen');
    
    // Agrega contenido específico para el permiso de examen
    doc.text(`Alumno: ${data.alumno}`, { align: 'left' });
    doc.text(`Materia: ${data.materia}`, { align: 'left' });
    doc.text(`Turno: ${data.turno}`, { align: 'left' });
    
    doc.end();
};

module.exports = { generatePermisoExamenPDF };
