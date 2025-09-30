const PDFDocument = require("pdfkit");
console.log("PDFDocument: racActaService");
const {
  addMembrete,
  addHeader,
  addTextWithMargins,
  MARGEN_TOP,
} = require("./pdfService");
const {
  getRacData,
  getAlumnoData,
  getCicloLectivoData,
  getPreviaData,
} = require("./dataService"); // Asegúrate de que la ruta sea correcta

const hoy = new Date();
//guardar la fecha de hoy en formato dd/mm/aaaa
const fecha =
  hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();

const drawTable = (
  doc,
  headers,
  rows,
  startX,
  startY,
  rowHeight,
  columnWidths,
  padding = 6
) => {
  let y = startY;
  const pageHeight = doc.page.height;
  const bottomMargin = 50;

  // Dibujar línea horizontal superior de la tabla
  doc
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  // Dibujar encabezados
  doc.font("Helvetica-Bold").fontSize(8);
  headers.forEach((header, i) => {
    doc.text(
      header,
      startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
      y + padding,
      {
        width: columnWidths[i] - 2 * padding,
        align: "center",
      }
    );
  });

  // Dibujar líneas verticales en el encabezado
  let x = startX;
  columnWidths.forEach((width) => {
    doc
      .moveTo(x, y)
      .lineTo(x, y + rowHeight)
      .stroke();
    x += width;
  });
  doc
    .moveTo(x, y)
    .lineTo(x, y + rowHeight)
    .stroke();

  y += rowHeight;

  // Dibujar línea horizontal inferior del encabezado
  doc
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  rows.forEach((row, rowIndex) => {
    // Verificar si se necesita un salto de página
    if (y + rowHeight + bottomMargin > pageHeight - 50) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .text("Continúa en la siguiente página...", startX, y + padding, {
          align: "left",
        });
      doc.addPage();
      y = 50;

      // Redibujar encabezados en la nueva página
      doc
        .lineWidth(0.5)
        .moveTo(startX, y)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
        .stroke();
      doc.font("Helvetica-Bold").fontSize(8);
      headers.forEach((header, i) => {
        doc.text(
          header,
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          y + padding,
          {
            width: columnWidths[i] - 2 * padding,
            align: "center",
          }
        );
      });

      // Dibujar líneas verticales en el encabezado de la nueva página
      x = startX;
      columnWidths.forEach((width) => {
        doc
          .moveTo(x, y)
          .lineTo(x, y + rowHeight)
          .stroke();
        x += width;
      });
      doc
        .moveTo(x, y)
        .lineTo(x, y + rowHeight)
        .stroke();

      y += rowHeight;
      doc
        .lineWidth(0.5)
        .moveTo(startX, y)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
        .stroke();
    }

    // Dibujar contenido de la fila
    headers.forEach((header, i) => {
      let fontSize = 8;
      doc.fontSize(fontSize);
      let textWidth = doc.widthOfString(row[i]);
      while (textWidth > columnWidths[i] - 2 * padding && fontSize > 4) {
        fontSize -= 0.5;
        doc.fontSize(fontSize);
        textWidth = doc.widthOfString(row[i]);
      }
      doc
        .font("Helvetica")
        .fontSize(fontSize)
        .text(
          row[i],
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          y + padding,
          {
            width: columnWidths[i] - 2 * padding,
            align: i === 1 ? "left" : "center",
            continued: false,
          }
        );
    });

    // Dibujar líneas horizontales para cada fila
    doc
      .moveTo(startX, y + rowHeight)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
      .stroke();

    // Dibujar líneas verticales para cada fila
    x = startX;
    columnWidths.forEach((width) => {
      doc
        .moveTo(x, y)
        .lineTo(x, y + rowHeight)
        .stroke();
      x += width;
    });
    doc
      .moveTo(x, y)
      .lineTo(x, y + rowHeight)
      .stroke();

    y += rowHeight;
  });

  return y;
};

const generateRACActaPDF = async (data, res) => {
  const doc = new PDFDocument({ size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=rac_acta.pdf");
  doc.pipe(res);

  try {
    const racData = await getRacData(data.id_alumno, data.id_ciclo);
    const alumnoData = await getAlumnoData(data.id_alumno);
    const cicloLectivoData = await getCicloLectivoData(data.id_ciclo);
    const previaData = await getPreviaData(data.id_alumno);

    addMembrete(doc);
    addHeader(
      doc.font("Helvetica-Bold").fontSize(14),
      `Registro Anual de Calificaciones`
    );
    addHeader(
      doc.moveDown(-1).font("Helvetica-Bold").fontSize(14),
      `CICLO LECTIVO ${cicloLectivoData.anio}`
    );
    addHeader(
      doc.moveDown(-1).font("Helvetica").fontSize(12),
      `Anexo - Exámenes Previos y Equivalencias`
    );

    doc.font("Helvetica-Bold").fontSize(10);
    addTextWithMargins(
      doc,
      `Estudiante: ${alumnoData.apellidos}, ${alumnoData.nombres}`,
      { y: MARGEN_TOP + 65 }
    );
    addTextWithMargins(doc, `DNI: ${alumnoData.dni}`, { y: MARGEN_TOP + 80 });

    doc.font("Helvetica").fontSize(10);
    doc.x = 50;
    doc
      .moveDown(0.5)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Listado de Espacios Curriculares Adeudados:", { align: "left" });

    const headers = [
      "Nº",
      "ESPACIO CURRICULAR",
      "CURSO",
      "CONDICIÓN",
      "C. LECTIVO",
      "PLAN",
      "ESTADO",
    ];
    const rows = previaData.map((item, index) => [
      index + 1,
      item.materia,
      item.curso,
      item.condicion,
      item.cicloLectivo,
      item.plan,
      item.aprobado === null
        ? "Error"
        : item.aprobado === false
        ? "DESAPROBADO"
        : "APROBADO",
    ]);

    let currentY = drawTable(
      doc,
      headers,
      rows,
      50,
      MARGEN_TOP + 110,
      20,
      [25, 180, 50, 75, 60, 60, 80]
    );

    currentY += 10;
    doc.x = 50;
    doc
      .moveDown(2)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Historial de Exámenes:", { align: "left" });

    const examHeaders = [
      "Nº",
      "ESPACIO CURRICULAR",
      "CURSO",
      "CONDICIÓN",
      "FECHA",
      "NOTA",
      "L",
      "F",
    ];
    const examRows = racData.map((item, index) => [
      index + 1,
      item.materia,
      item.curso,
      item.condicionHistorica,
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
      currentY + 20,
      20,
      [25, 180, 50, 75, 60, 60, 40, 40]
    );

    doc.x = 50;
    doc
      .moveDown(2)
      .fontSize(10)
      .text(`Villa General Belgrano, ${fecha}`, { align: "right" });
    doc.end();
  } catch (error) {
    console.error("Error al procesar el PDF:", error);
    if (!res.headersSent) {
      res.status(500).send("Error al procesar el PDF");
    }
  }
};

module.exports = { generateRACActaPDF };
