const PDFDocument = require("pdfkit");
const { getResumenInscriptosExamenes } = require("../pdf/dataService");
const { addMembrete } = require("../pdf/pdfService");

const cmToPt = (cm) => cm * 28.35;

const setMarginsForPage = (doc, pageNumber) => {
  const isEven = pageNumber % 2 === 0;
  doc.page.margins = {
    top: cmToPt(4),
    bottom: cmToPt(3.5),
    left: cmToPt(isEven ? 2 : 2.5),
    right: cmToPt(isEven ? 2.5 : 2),
  };
};

const drawPageNumber = (doc, pageNumber) => {
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Página ${pageNumber}`, doc.page.width - 80, doc.page.height - 30, {
      align: "right",
    });
};

const drawHeader = (doc, turno) => {
  let y = doc.page.margins.top;
  addMembrete(doc);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("black");
  doc.text("LISTADO DE INSCRIPTOS A EXÁMENES", doc.page.margins.left, y, {
    align: "center",
  });
  y += 30;
  doc
    .fontSize(10)
    .text(
      `Resumen de Inscriptos - Turno ${turno.nombre} - Ciclo ${
        turno.CicloLectivo?.anio ?? ""
      }`,
      doc.page.margins.left,
      y,
      { align: "center", underline: true }
    );
  return y + 30;
};

const drawTableHeader = (doc, y, columnas, rowHeight) => {
  let x = doc.page.margins.left;
  doc.font("Helvetica-Bold").fontSize(7);
  columnas.forEach((col) => {
    doc
      .rect(x, y, col.width, rowHeight)
      .strokeColor("black")
      .lineWidth(0.5)
      .stroke();
    doc.text(col.label, x + 2, y + 5, {
      width: col.width - 4,
      align: col.align,
    });
    x += col.width;
  });
  return y + rowHeight;
};

const drawTableRow = (doc, y, columnas, values, rowHeight) => {
  let x = doc.page.margins.left;
  doc.font("Helvetica").fontSize(7);
  values.forEach((val, i) => {
    const col = columnas[i];
    doc
      .rect(x, y, col.width, rowHeight)
      .strokeColor("black")
      .lineWidth(0.5)
      .stroke();
    doc.text(val?.toString() ?? "", x + 2, y + 5, {
      width: col.width - 4,
      align: col.align,
    });
    x += col.width;
  });
  return y + rowHeight;
};

const drawSummary = (doc, turno, resumen, pageNumber) => {
  doc.addPage();
  pageNumber++;
  setMarginsForPage(doc, pageNumber);
  addMembrete(doc);
  drawPageNumber(doc, pageNumber);

  let y = drawHeader(doc, turno);
  y += 40;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Resumen Estadístico", doc.page.margins.left, y, {
      align: "center",
    });

  const total = resumen.length;
  const aprobados = resumen.filter((r) => r.Aprobado === true).length;
  const ausentes = resumen.filter((r) => r.Nota === "Aus.").length;
  const desaprobados = total - aprobados - ausentes;

  y += 30;
  doc.fontSize(9).text(`Aprobados: ${aprobados}`, doc.page.margins.left, y);
  doc.text(`Desaprobados: ${desaprobados}`, doc.page.margins.left, y + 15);
  doc.text(`Ausentes: ${ausentes}`, doc.page.margins.left, y + 30);
  doc.text(`Total: ${total}`, doc.page.margins.left, y + 45);
};

const generarResumenInscriptosPDF = async (req, res) => {
  try {
    const { id_turno, condiciones } = req.body;
    const { resumen, turno } = await getResumenInscriptosExamenes(
      id_turno,
      condiciones
    );

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=ResumenInscriptos.pdf"
      );
      res.send(pdfData);
    });

    let currentPage = 1;
    setMarginsForPage(doc, currentPage);
    drawPageNumber(doc, currentPage);

    const columnas = [
      { label: "N°", width: 15, align: "center" },
      { label: "Apellido", width: 70, align: "left" },
      { label: "Nombre", width: 70, align: "left" },
      { label: "DNI", width: 40, align: "center" },
      { label: "Materia", width: 100, align: "left" },
      { label: "Fecha", width: 60, align: "center" },
      { label: "Condición", width: 60, align: "center" },
      { label: "Curso", width: 25, align: "center" },
      { label: "Nota", width: 20, align: "center" },
      { label: "L", width: 20, align: "center" },
      { label: "F", width: 20, align: "center" },
    ];

    const rowHeight = 20;
    const pageHeight =
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
    const maxRowsPerPage = Math.floor((pageHeight - 150) / rowHeight);

    let y = drawHeader(doc, turno);
    y = drawTableHeader(doc, y, columnas, rowHeight);

    let rowCount = 0;
    resumen.forEach((r, idx) => {
      if (rowCount >= maxRowsPerPage) {
        doc.addPage();
        currentPage++;
        setMarginsForPage(doc, currentPage);
        drawPageNumber(doc, currentPage);
        y = drawHeader(doc, turno);
        y = drawTableHeader(doc, y, columnas, rowHeight);
        rowCount = 0;
      }

      y = drawTableRow(
        doc,
        y,
        columnas,
        [
          idx + 1,
          r.Apellido_Alumno,
          r.Nombre_Alumno,
          r.DNI,
          r.Nombre_Materia,
          r.Fecha_Examen,
          r.Condicion,
          r.Nombre_Curso,
          r.Nota ?? "-",
          r.L,
          r.F,
        ],
        rowHeight
      );

      rowCount++;
    });

    drawSummary(doc, turno, resumen, currentPage);
    doc.end();
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  generarResumenInscriptosPDF,
};
