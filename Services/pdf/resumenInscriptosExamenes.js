const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { getResumenInscriptosExamenes } = require("./dataService");

const MARGEN_TOP = 72;
const MARGEN_BOTTOM = 72;
const MARGEN_LEFT = 50;
const MARGEN_RIGHT = 30;

const hoy = new Date();
const fecha =
  hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();

function addMembrete(doc) {
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "Img",
    "MEMBRETE - 2024 - completo.png"
  );
  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  }
}

function drawTableWithPagination(
  doc,
  headers,
  rows,
  startX,
  startY,
  rowHeight,
  columnWidths,
  padding = 6
) {
  const PAGE_HEIGHT = doc.page.height;
  let y = startY;
  let pageNumber = 1;

  const drawPageNumber = () => {
    doc
      .fontSize(8)
      .text(
        `Página ${pageNumber}`,
        doc.page.width - MARGEN_RIGHT - 20,
        doc.page.height - MARGEN_BOTTOM + 20,
        {
          align: "left",
        }
      );
  };

  const drawHeader = () => {
    // Línea superior
    doc
      .lineWidth(0.5)
      .moveTo(startX, y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .stroke();

    doc.font("Helvetica-Bold").fontSize(8);

    headers.forEach((header, i) => {
      const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(header, x + padding, y + padding, {
        width: columnWidths[i] - 2 * padding,
        align: "center",
      });

      // Línea vertical
      doc
        .moveTo(x, y)
        .lineTo(x, y + rowHeight)
        .stroke();
    });

    // Línea vertical final
    doc
      .moveTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
      .stroke();

    y += rowHeight;

    // Línea inferior
    doc
      .moveTo(startX, y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .stroke();
  };

  const startNewPage = () => {
    doc.addPage();
    pageNumber++;
    addMembrete(doc);
    y = MARGEN_TOP + 25;
    drawHeader();
    drawPageNumber();
  };

  addMembrete(doc);
  drawHeader();
  drawPageNumber();

  rows.forEach((row) => {
    if (y + rowHeight + MARGEN_BOTTOM > PAGE_HEIGHT) {
      startNewPage();
    }

    headers.forEach((_, i) => {
      const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
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
        .text(row[i], x + padding, y + padding, {
          width: columnWidths[i] - 2 * padding,
          align: i === 1 ? "left" : "center",
        });

      // Línea vertical
      doc
        .moveTo(x, y)
        .lineTo(x, y + rowHeight)
        .stroke();
    });

    // Línea vertical final
    doc
      .moveTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
      .stroke();

    y += rowHeight;

    // Línea horizontal inferior
    doc
      .moveTo(startX, y)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y)
      .stroke();
  });

  return y;
}
/*
function checkPageSpace(doc, currentY, requiredHeight) {
  const PAGE_HEIGHT = doc.page.height;
  return currentY + requiredHeight + MARGEN_BOTTOM <= PAGE_HEIGHT;
}
*/
async function generarResumenInscriptosPDF(req, res) {
  try {
    const { id_turno, condiciones } = req.body;

    const { resumen, turno } = await getResumenInscriptosExamenes(
      id_turno,
      condiciones
    );

    if (!Array.isArray(resumen)) {
      console.error("El resultado no es un array:", resumen);
      return res.status(500).send("Error interno: datos no válidos");
    }

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const filename = `Resumen_Inscriptos_${id_turno}.pdf`;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${filename}\"`
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    let currentY = MARGEN_TOP + 25;

    // Encabezado
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(
        `Resumen de Inscriptos a Exámenes - Turno ${turno.nombre} - CL: ${turno.CicloLectivo?.anio}`,
        MARGEN_LEFT,
        currentY,
        { align: "center" }
      );
    currentY += 25;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Fecha de generación: ${fecha}`, MARGEN_LEFT, currentY, {
        align: "left",
      });
    currentY += 20;

    // Tabla principal
    const headers = [
      "Nº",
      "Alumno",
      "Espacio Curricular",
      "Cur.",
      "Condición",
      "Fecha / Hora",
      "Cal",
      "L",
      "F",
    ];
    const rows = resumen.map((item, index) => [
      index + 1,
      `${item.Apellido_Alumno}, ${item.Nombre_Alumno}`,
      item.Nombre_Materia,
      item.Nombre_Curso,
      item.Condicion,
      item.Fecha_Examen,
      item.Nota !== null ? item.Nota : "",
      item.L || "",
      item.F || "",
    ]);

    currentY = drawTableWithPagination(
      doc.fontSize(8),
      headers,
      rows,
      MARGEN_LEFT,
      currentY + 10,
      20,
      [30, 120, 120, 30, 60, 75, 25, 25, 25]
    );

    // Tabla de porcentajes
    const total = resumen.filter((r) => r.Nota !== "").length ?? 0;
    const aprobados = resumen.filter((r) => r.Aprobado === true).length ?? 0;
    const desaprobados =
      resumen.filter((r) => r.Nota >= 1 && r.Nota <= 6).length ?? 0;
    const ausentes = resumen.filter((r) => r.Nota === "Aus.").length ?? 0;
    const totalInscriptos = resumen.length ?? 0;

    const porcentaje = (valor) =>
      total > 0 ? ((valor / total) * 100).toFixed(2) + "%" : "0.00%";

    const resumenFinal = [
      ["Aprobados", aprobados, porcentaje(aprobados)],
      ["Desaprobados", desaprobados, porcentaje(desaprobados)],
      ["Ausentes", ausentes, porcentaje(ausentes)],
      [
        `TOTAL (${totalInscriptos} inscriptos)`,
        total,
        porcentaje(aprobados + desaprobados + ausentes),
      ],
    ];

    currentY += 30;

    if (
      currentY + resumenFinal.length * 20 + 40 >
      doc.page.height - MARGEN_BOTTOM
    ) {
      doc.addPage();
      addMembrete(doc);
      currentY = MARGEN_TOP + 25;
    }
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Resumen de Resultados", MARGEN_LEFT, currentY, { align: "left" });
    currentY += 20;

    const colWidths = [150, 100, 100];
    doc
      .lineWidth(0.5)
      .moveTo(MARGEN_LEFT, currentY)
      .lineTo(MARGEN_LEFT + colWidths.reduce((a, b) => a + b, 0), currentY)
      .stroke();

    resumenFinal.forEach((fila, i) => {
      fila.forEach((texto, j) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(
            texto,
            MARGEN_LEFT + colWidths.slice(0, j).reduce((a, b) => a + b, 0) + 6,
            currentY + 6,
            {
              width: colWidths[j] - 12,
              align: "center",
            }
          );

        // Líneas verticales
        doc
          .moveTo(
            MARGEN_LEFT + colWidths.slice(0, j).reduce((a, b) => a + b, 0),
            currentY
          )
          .lineTo(
            MARGEN_LEFT + colWidths.slice(0, j).reduce((a, b) => a + b, 0),
            currentY + 20
          )
          .stroke();
      });

      // Línea horizontal inferior
      currentY += 20;
      doc
        .moveTo(MARGEN_LEFT, currentY)
        .lineTo(MARGEN_LEFT + colWidths.reduce((a, b) => a + b, 0), currentY)
        .stroke();
    });

    // Línea vertical final derecha
    doc
      .moveTo(
        MARGEN_LEFT + colWidths.reduce((a, b) => a + b, 0),
        currentY - resumenFinal.length * 20
      )
      .lineTo(MARGEN_LEFT + colWidths.reduce((a, b) => a + b, 0), currentY)
      .stroke();

    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    if (!res.headersSent) {
      res.status(500).send("Error al generar el PDF");
    }
  }
}

module.exports = {
  generarResumenInscriptosPDF,
};
