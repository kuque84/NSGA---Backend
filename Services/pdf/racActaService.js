const PDFDocument = require('pdfkit');
const { addMembrete, addHeader, addTextWithMargins, MARGEN_TOP } = require('./pdfService');
const { getRacData, getAlumnoData, getCicloLectivoData, getPreviaData } = require('./dataService'); // Asegúrate de que la ruta sea correcta
const hoy = new Date();
//guardar la fecha de hoy en formato dd/mm/aaaa
const fecha = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();

const drawTable = (doc, headers, rows, startX, startY, rowHeight, columnWidths, padding = 6) => {
  let y = startY;

  // Dibujar línea horizontal superior de la tabla
  doc
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  // Dibujar encabezados
  doc.font('Helvetica-Bold').fontSize(8);
  headers.forEach((header, i) => {
    doc.text(
      header,
      startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
      y + padding,
      { width: columnWidths[i] - 2 * padding, align: 'center' }
    );
  });

  y += rowHeight;

  // Dibujar línea horizontal inferior del encabezado
  doc
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  // Dibujar filas
  rows.forEach((row, rowIndex) => {
    headers.forEach((header, i) => {
      let fontSize = 8;
      let textWidth = doc.widthOfString(row[i], { fontSize });

      // Reducir el tamaño de la fuente si el texto no cabe en la celda
      while (textWidth > columnWidths[i] - 2 * padding && fontSize > 4) {
        fontSize -= 0.5;
        textWidth = doc.widthOfString(row[i], { fontSize });
      }

      doc
        .font('Helvetica')
        .fontSize(fontSize)
        .text(
          row[i],
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
          y + padding,
          {
            width: columnWidths[i] - 2 * padding,
            align: i === 1 ? 'left' : 'center',
            continued: false,
          }
        );
    });
    y += rowHeight;

    // Dibujar líneas horizontales para cada fila
    doc
      .moveTo(startX, y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .stroke();
  });

  // Dibujar líneas verticales
  let x = startX;
  columnWidths.forEach((width) => {
    doc.moveTo(x, startY).lineTo(x, y).stroke();
    x += width;
  });
  // Dibujar la última línea vertical
  doc.moveTo(x, startY).lineTo(x, y).stroke();

  // Devolver la nueva posición y
  return y;
};

const generateRACActaPDF = async (data, res) => {
  const doc = new PDFDocument({ size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=rac_acta.pdf');
  doc.pipe(res);

  doc.on('error', (err) => {
    console.error('Error en PDF:', err);
    if (!res.headersSent) {
      res.status(500).send('Error al generar el PDF');
    }
  });

  try {
    // Obtener los datos del RAC
    const racData = await getRacData(data.id_alumno, data.id_ciclo);
    const alumnoData = await getAlumnoData(data.id_alumno);
    const cicloLectivoData = await getCicloLectivoData(data.id_ciclo);
    const previaData = await getPreviaData(data.id_alumno);

    // Agregar membrete y encabezados
    addMembrete(doc);
    addHeader(doc.font('Helvetica-Bold').fontSize(14), `Registro Anual de Calificaciones`);
    addHeader(
      doc.moveDown(-1).font('Helvetica-Bold').fontSize(14),
      `CICLO LECTIVO ${cicloLectivoData.anio}`
    );
    addHeader(
      doc.moveDown(-1).font('Helvetica').fontSize(12),
      `Anexo - Examenes Previos y Equivalencias`
    );

    // Agregar información del alumno y ciclo lectivo en negrita
    doc.font('Helvetica-Bold').fontSize(10);
    addTextWithMargins(doc, `Estudiante: ${alumnoData.apellidos}, ${alumnoData.nombres}`, {
      y: MARGEN_TOP + 80,
    });
    addTextWithMargins(doc, `DNI: ${alumnoData.dni}`, {
      y: MARGEN_TOP + 95,
    });

    // Restablecer la fuente a la normal si es necesario
    doc.font('Helvetica').fontSize(10);

    // Agregar tabla de avance de notas
    doc.x = 50;
    doc
      .moveDown(1)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Listado de Espacios Curriculares Previos:', { align: 'left' });

    const headers = [
      'Nº',
      'ESPACIO CURRICULAR',
      'CURSO',
      'CONDICIÓN',
      'C. LECTIVO',
      'PLAN',
      'ESTADO',
    ];
    const rows = previaData.map((item, index) => [
      index + 1,
      item.materia,
      item.curso,
      item.condicion,
      item.cicloLectivo,
      item.plan,
      item.aprobado === null || item.aprobado === false
        ? 'DESAPROBADO'
        : item.aprobado === true
        ? 'APROBADO'
        : 'Error',
    ]);

    let currentY = drawTable(
      doc,
      headers,
      rows,
      50,
      MARGEN_TOP + 130,
      20,
      [25, 180, 50, 75, 60, 60, 80]
    );

    // Agregar "Historial de Exámenes" debajo de la primera tabla
    currentY += 10; // Añadir un espacio entre las tablas
    doc.x = 50;
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(10).text('Historial de Exámenes:', { align: 'left' });

    // Agregar tabla de historial de exámenes
    const examHeaders = [
      'Nº',
      'ESPACIO CURRICULAR',
      'CURSO',
      'CONDICIÓN',
      'FECHA',
      'NOTA',
      'L',
      'F',
    ];
    const examRows = racData.map((item, index) => [
      index + 1,
      item.materia,
      item.curso,
      item.condicion,
      new Date(item.fechaExamen).toLocaleDateString(),
      item.calificacion,
      item.libro,
      item.folio,
    ]);

    currentY = drawTable(
      doc,
      examHeaders,
      examRows,
      50,
      currentY + 20, // Ajustar la posición y para evitar superposición
      20,
      [25, 180, 50, 75, 60, 60, 40, 40]
    );

    doc.x = 50;
    doc.moveDown(5).fontSize(10).text(`Villa General Belgrano, ${fecha}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    if (!res.headersSent) {
      res.status(500).send('Error al procesar el PDF');
    }
  }
};

module.exports = { generateRACActaPDF };
