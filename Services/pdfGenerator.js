const PdfPrinter = require("pdfmake");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

// --------------------------------------------------------
// 1. FUNCIONES AUXILIARES (Abreviación y Altura)
// --------------------------------------------------------

/**
 * Aplica abreviaturas a partes comunes de los nombres de materia.
 * @param {string} text
 * @returns {string} Texto abreviado.
 */
function abbreviateSubjectName(text) {
  if (!text) return "";
  let abbreviated = text.toUpperCase(); // Reemplazos de abreviaturas solicitadas

  abbreviated = abbreviated.replace(
    /\bEDUCACIÓN ARTÍSTICA - ARTES VISUALES\b/g,
    "ARTES VIS"
  );
  abbreviated = abbreviated.replace(
    /\bADMINISTRACIÓN DE LA PRODUCCIÓN Y COMERCIALIZACIÓN\b/g,
    "AD PROD Y COM"
  );
  abbreviated = abbreviated.replace(
    /\bECONOMÍA Y DESARROLLO SUSTENTABLE\b/g,
    "ECO Y DES SUST"
  );
  abbreviated = abbreviated.replace(
    /\bFORMACIÓN PARA LA VIDA Y EL TRABAJO\b/g,
    "FVT"
  );
  abbreviated = abbreviated.replace(/\bADMINISTRACIÓN FINANCIERA\b/g, "AD FIN");
  abbreviated = abbreviated.replace(
    /\bADMINISTRACIÓN DE RECURSOS HUMANOS\b/g,
    "AD RRHH"
  );
  abbreviated = abbreviated.replace(
    /\bRESPONSABILIDAD SOCIAL DE LAS ORGANIZACIONES\b/g,
    "RSO"
  );
  abbreviated = abbreviated.replace(
    /\bEDUCACIÓN ARTÍSTICA - TEATRO\b/g,
    "TEATRO"
  );
  abbreviated = abbreviated.replace(
    /\bSISTEMAS DE INFORMACIÓN CONTABLE\b/g,
    "SIC"
  );
  abbreviated = abbreviated.replace(
    /\bLENGUA EXTRANJERA - INGLÉS\b/g,
    "LE INGLÉS"
  );
  abbreviated = abbreviated.replace(/\bLENGUA Y LITERATURA\b/g, "LENG Y LIT");
  abbreviated = abbreviated.replace(/\bEDUCACIÓN FÍSICA\b/g, "ED FÍSICA");
  abbreviated = abbreviated.replace(/\bCIUDADANÍA Y POLÍTICA\b/g, "CIUD Y POL");
  abbreviated = abbreviated.replace(
    /\bEDUCACIÓN ARTÍSTICA - MÚSICA\b/g,
    "MÚSICA"
  );
  abbreviated = abbreviated.replace(
    /\bEDUCACIÓN ARTÍSTICA - ARTES VISUALES\b/g,
    "ARTES VISUALES"
  );
  abbreviated = abbreviated.replace(
    /\bEDUCACIÓN TECNOLÓGICA\b/g,
    "ED TECNOLÓGICA"
  );
  abbreviated = abbreviated.replace(
    /\bCIENCIAS NATURALES - BIOLOGÍA\b/g,
    "CS NAT BIOLOGÍA"
  );
  abbreviated = abbreviated.replace(
    /\bCIENCIAS NATURALES - QUÍMICA\b/g,
    "CS NAT QUÍMICA"
  );
  abbreviated = abbreviated.replace(
    /\bCIENCIAS NATURALES - FÍSICA\b/g,
    "CS NAT FÍSICA"
  );
  abbreviated = abbreviated.replace(
    /\bCIENCIAS SOCIALES - HISTORIA\b/g,
    "CS SOC HISTORIA"
  );
  abbreviated = abbreviated.replace(
    /\bCIENCIAS SOCIALES - GEOGRAFÍA\b/g,
    "CS SOC GEOGRAFÍA"
  );
  abbreviated = abbreviated.replace(
    /\bCIUDADANÍA Y PARTICIPACIÓN\b/g,
    "CIUD Y PART"
  );

  abbreviated = abbreviated.replace(
    /\bTECONOLOGÍAS DE LA INFORMACIÓN Y LA COMUNICACIÓN\b/g,
    "TIC"
  );
  /* abbreviated = abbreviated.replace(/\b\b/g, ""); */

  return abbreviated.trim();
}

/**
 * Convierte el texto abreviado en texto vertical (apilando caracteres con \n).
 * @param {string} text
 * @returns {string}
 */
function toVerticalText(text) {
  const abbreviatedText = abbreviateSubjectName(text);
  return abbreviatedText.split("").join("\n");
}

/**
 * Calcula la altura mínima (minHeight) requerida para la fila de encabezados
 * en base al nombre de materia más largo (abreviado).
 * @param {Array<{nombre: string}>} materiasColoquio - Lista de objetos de materia.
 * @returns {number} La altura mínima en puntos.
 */
function calculateHeaderHeight(materiasColoquio) {
  if (!materiasColoquio || materiasColoquio.length === 0) return 60;

  const maxChars = materiasColoquio.reduce((max, materia) => {
    const abbreviatedName = abbreviateSubjectName(materia.nombre);
    return Math.max(max, abbreviatedName ? abbreviatedName.length : 0);
  }, 0); // Heurística de altura (factor de 9 puntos por carácter + 30 de padding)

  const calculatedHeight = maxChars * 9 + 30;

  return Math.max(60, calculatedHeight);
}

// --------------------------------------------------------
// 2. GENERADORES DE SECCIONES DEL DOCUMENTO
// --------------------------------------------------------

/**
 * Genera el contenido del título y subtítulo del documento.
 * @param {object} grupo - Datos del grupo (curso y división).
 * @returns {Array<object>} - Contenido de pdfmake.
 */
function generateTitleContent(grupo) {
  return [
    {
      text: `CURSO: ${grupo.cursoNombre} - DIVISIÓN: ${grupo.divisionNombre}`,
      style: "header",
    },
    {
      text: `LISTADO DE ALUMNOS A COLOQUIO`,
      style: "subheader",
    },
    { text: " ", margin: [0, 5, 0, 10] },
  ];
}

/**
 * Genera la tabla completa (encabezados y cuerpo, incluyendo fila TOTAL).
 * @param {object} grupo - Datos del grupo (alumnos, materias).
 * @param {number} headerMinHeight - Altura mínima calculada para la fila de encabezados.
 * @returns {object} - Objeto de tabla de pdfmake.
 */
function generateTable(grupo, headerMinHeight) {
  const tableHeaders = [];
  const columnWidths = [];

  // Inicializar totales
  const subjectTotals = {};
  grupo.materiasColoquio.forEach((m) => {
    subjectTotals[m.id] = 0;
  }); // 1. Encabezado de la columna de Alumno

  tableHeaders.push({
    text: "Alumno (Apellidos, Nombres)",
    style: "tableHeader",
    alignment: "left",
    minHeight: headerMinHeight,
    fillColor: "#CCCCCC",
  });
  columnWidths.push("30%"); // 2. Encabezados de materia (Texto Vertical Simulado)

  grupo.materiasColoquio.forEach((m) => {
    tableHeaders.push({
      text: toVerticalText(m.nombre),
      style: "tableHeader",
      alignment: "center",
      minHeight: headerMinHeight,
      fillColor: "#CCCCCC",
    });
    columnWidths.push("*");
  }); // Filas de Datos (Cuerpo de la tabla)

  const tableBody = [tableHeaders];

  grupo.alumnos.forEach((alumno) => {
    const row = [{ text: alumno.nombreCompleto, alignment: "left" }]; // Rellena con 'C' o vacío y cuenta totales

    grupo.materiasColoquio.forEach((materia) => {
      const mark = alumno.inscripciones[materia.id] || "";
      row.push({
        text: mark,
        alignment: "center",
        fontSize: 12,
        bold: true,
      });
      // Contar si la marca es 'C'
      if (mark === "C") {
        subjectTotals[materia.id]++;
      }
    });
    tableBody.push(row);
  });

  // 3. Fila TOTAL
  const totalRow = [
    {
      text: "TOTAL",
      style: "tableTotal",
      alignment: "left",
      fillColor: "#E0E0E0",
    },
  ];

  grupo.materiasColoquio.forEach((materia) => {
    totalRow.push({
      text: subjectTotals[materia.id].toString(),
      style: "tableTotal",
      alignment: "center",
      fillColor: "#E0E0E0",
    });
  });
  tableBody.push(totalRow); // Estructura de la Tabla

  return {
    table: {
      headerRows: 1,
      widths: columnWidths,
      body: tableBody,
    },
    layout: {
      // Estilos de línea
      hLineWidth: (i, node) =>
        i === 0 || i === node.table.body.length ? 2 : 1,
      vLineWidth: (i, node) =>
        i === 0 || i === node.table.widths.length ? 2 : 1,
      hLineColor: (i, node) =>
        i === 0 || i === node.table.body.length ? "#000000" : "#CCCCCC",
      vLineColor: (i, node) =>
        i === 0 || i === node.table.widths.length ? "#000000" : "#CCCCCC", // Relleno de filas
      fillColor: (rowIndex, node, colIndex) =>
        rowIndex % 2 === 0 &&
        rowIndex > 0 &&
        rowIndex < node.table.body.length - 1
          ? "#f3f3f3"
          : null,
      paddingTop: (i, node) => 5,
      paddingBottom: (i, node) => 5,
    },
  };
}

// --------------------------------------------------------
// 3. FUNCIÓN PRINCIPAL
// --------------------------------------------------------

async function generarPDF(listado) {
  const printer = new PdfPrinter(fonts);
  const contentArray = [];
  const grupos = Object.entries(listado);

  for (let i = 0; i < grupos.length; i++) {
    const [key, grupo] = grupos[i]; // 1. Salto de página

    if (i > 0) {
      contentArray.push({ text: "", pageBreak: "before" });
    } // 2. Calcular altura dinámica

    const headerMinHeight = calculateHeaderHeight(grupo.materiasColoquio); // 3. Generar Título

    contentArray.push(...generateTitleContent(grupo)); // 4. Generar Tabla

    contentArray.push(generateTable(grupo, headerMinHeight));
  } // Definición de estilos

  const docDefinition = {
    content: contentArray,
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 2],
      },
      subheader: { fontSize: 12, alignment: "center", margin: [0, 0, 0, 10] },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: "black",
        alignment: "center",
      },
      // 🛑 NUEVO ESTILO PARA LA FILA TOTAL
      tableTotal: {
        bold: true,
        fontSize: 10,
        color: "black",
        alignment: "center",
        // Es importante definir el relleno aquí si queremos que sea diferente al resto
        // de las filas de datos, aunque el layout general lo maneja.
      },
    },
    defaultStyle: {
      fontSize: 10,
      font: "Helvetica",
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return new Promise((resolve, reject) => {
    try {
      const buffers = [];
      pdfDoc.on("data", buffers.push.bind(buffers));
      pdfDoc.on("end", () => resolve(Buffer.concat(buffers)));
      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generarPDF };
