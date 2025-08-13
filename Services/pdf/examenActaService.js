const PDFDocument = require("pdfkit");
const {
  addMembrete,
  addHeader,
  addTextWithMargins,
  MARGEN_TOP,
} = require("./pdfService");

const MARGEN_TOP_LOCAL = MARGEN_TOP - 28.35;
//console.log('MARGEN_TOP_LOCAL:', MARGEN_TOP_LOCAL);

const drawTable = (
  doc, // El documento PDF en el que estamos trabajando
  headers, // Los encabezados principales de la tabla
  subHeaders, // Los subencabezados de la tabla
  rows, // Las filas de datos de la tabla
  startX, // La posición X inicial de la tabla
  startY, // La posición Y inicial de la tabla
  rowHeight, // La altura de cada fila
  columnWidths, // Los anchos de cada columna
  padding = 6 // El padding (espacio) dentro de cada celda
) => {
  let y = startY; // La posición Y actual, comenzando en startY

  // Dibujar línea horizontal superior de la tabla
  doc
    .lineWidth(0.5) // Establecer el grosor de la línea
    .moveTo(startX, y) // Mover a la posición inicial de la línea
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
    .stroke(); // Aplicar el trazo

  // Dibujar encabezados principales
  doc.font("Helvetica-Bold").fontSize(8); // Establecer la fuente y el tamaño del texto
  headers.forEach((header, i) => {
    const colspan = header.colspan + 1; // Obtener el colspan (número de columnas que abarca)
    const width = columnWidths.slice(i, i + colspan).reduce((a, b) => a + b, 0); // Calcular el ancho total de la celda combinada
    const textHeight = doc.heightOfString(header.text, {
      width: width - 2 * padding,
    }); // Calcular la altura del texto
    const textY = y + (rowHeight - textHeight) / 2; // Centrar verticalmente el texto en la celda
    doc.text(
      header.text, // El texto del encabezado
      startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding, // La posición X del texto
      textY, // La posición Y del texto
      { width: width - 2 * padding, align: "center" } // Opciones de formato del texto: ancho y alineación
    );
  });

  y += rowHeight; // Mover la posición Y hacia abajo para la siguiente fila

  // Dibujar subencabezados
  subHeaders.forEach((subHeader, i) => {
    const textHeight = doc.heightOfString(subHeader, {
      width: columnWidths[i] - 2 * padding,
    }); // Calcular la altura del texto
    const textY = y + (i < 3 ? (rowHeight - textHeight) / 2 : padding); // Centrar verticalmente solo a las columnas 4, 5 y 6
    doc.text(
      subHeader, // El texto del subencabezado
      startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding, // La posición X del texto
      textY, // La posición Y del texto
      { width: columnWidths[i] - 2 * padding, align: "center" } // Opciones de formato del texto: ancho y alineación
    );
  });

  y += rowHeight; // Mover la posición Y hacia abajo para la siguiente fila

  // Dibujar línea horizontal inferior del encabezado
  doc
    .lineWidth(0.5) // Establecer el grosor de la línea
    .moveTo(startX, y) // Mover a la posición inicial de la línea
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
    .stroke(); // Aplicar el trazo

  // Dibujar filas
  rows.forEach((row, rowIndex) => {
    headers.forEach((header, i) => {
      let fontSize = 8;
      doc.fontSize(fontSize); // Aplicar el tamaño de la fuente antes de calcular el ancho del texto
      let textWidth = doc.widthOfString(row[i]);

      // Reducir el tamaño de la fuente si el texto no cabe en la celda
      while (textWidth > columnWidths[i] - 2 * padding && fontSize > 4) {
        fontSize -= 0.5;
        doc.fontSize(fontSize); // Aplicar el nuevo tamaño de la fuente
        textWidth = doc.widthOfString(row[i]); // Recalcular el ancho del texto
      }

      const textHeight = doc.heightOfString(row[i], {
        width: columnWidths[i] - 2 * padding,
      }); // Calcular la altura del texto
      const textY = y + (rowHeight - textHeight) / 2; // Centrar verticalmente el texto en la celda

      doc
        .font("Helvetica")
        .fontSize(fontSize)
        .text(
          row[i], // El texto de la celda
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding, // La posición X del texto
          textY, // La posición Y del texto
          {
            width: columnWidths[i] - 2 * padding, // El ancho de la celda
            align: i === 2 ? "left" : "center", // Alinear a la izquierda solo la columna de "Apellido y Nombre"
            continued: false, // No continuar el texto en la siguiente línea
          }
        );
    });
    y += rowHeight; // Mover la posición Y hacia abajo para la siguiente fila

    // Dibujar líneas horizontales para cada fila
    doc
      .moveTo(startX, y) // Mover a la posición inicial de la línea
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
      .stroke(); // Aplicar el trazo
  });

  // Dibujar líneas verticales
  let x = startX;
  columnWidths.forEach((width, i) => {
    if (i !== 4 && i !== 5) {
      // No dibujar líneas verticales internas en la primera fila para columnas 5 y 6
      doc.moveTo(x, startY).lineTo(x, y).stroke();
    }
    x += width;
  });
  // Dibujar la última línea vertical
  doc.moveTo(x, startY).lineTo(x, y).stroke();

  // Dibujar la línea horizontal inferior de la primera fila combinada
  doc
    .moveTo(
      startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0),
      startY + rowHeight
    )
    .lineTo(
      startX + columnWidths.slice(0, 6).reduce((a, b) => a + b, 0),
      startY + rowHeight
    )
    .stroke();

  // Dibujar las líneas verticales internas solo en la segunda fila para columnas 4, 5 y 6
  let x4 = startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0);
  let x5 = x4 + columnWidths[3];
  let x6 = x5 + columnWidths[4];
  doc.moveTo(x4, startY).lineTo(x4, y).stroke(); // Dibujar la línea izquierda de la columna 4 en la primera fila
  doc
    .moveTo(x5, startY + rowHeight)
    .lineTo(x5, y)
    .stroke();
  doc
    .moveTo(x6, startY + rowHeight)
    .lineTo(x6, y)
    .stroke();

  // Devolver la nueva posición y
  return y;
};

const drawCursoTable = (
  doc,
  cursoData,
  startX,
  startY,
  rowHeight,
  columnWidths
) => {
  const headers = ["Curso", "División", "Turno"];
  const padding = 6;

  console.log("drawCursoTable - cursoData:", cursoData);
  console.log(
    "drawCursoTable - startX:",
    startX,
    "startY:",
    startY,
    "rowHeight:",
    rowHeight,
    "columnWidths:",
    columnWidths
  );

  try {
    // Dibujar línea horizontal superior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawCursoTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error("Error al dibujar la línea horizontal superior:", error);
  }

  try {
    // Dibujar encabezados
    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((header, i) => {
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(header, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawCursoTable - header:",
        header,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc.text(
        header,
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
        textY,
        {
          width: width - 2 * padding,
          align: "center",
        }
      );
    });
  } catch (error) {
    console.error("Error al dibujar los encabezados:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior del encabezado
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawCursoTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior del encabezado:",
      error
    );
  }

  try {
    // Dibujar datos
    cursoData.forEach((data, i) => {
      console.log("drawCursoTable - data:", data);
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(data, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawCursoTable - data:",
        data,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc
        .font("Helvetica")
        .fontSize(8)
        .text(
          data,
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          textY,
          {
            width: width - 2 * padding,
            align: "center",
          }
        );
    });
  } catch (error) {
    console.error("Error al dibujar los datos:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawCursoTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior de la tabla:",
      error
    );
  }

  try {
    // Dibujar líneas verticales
    let x = startX;
    columnWidths.forEach((width) => {
      console.log(
        "drawCursoTable - vertical line x:",
        x,
        "width:",
        width,
        "startY:",
        startY,
        "endY:",
        startY - rowHeight * 2
      );
      if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
        throw new Error("Invalid coordinates for lineTo");
      }
      doc
        .moveTo(x, startY - rowHeight * 2)
        .lineTo(x, startY)
        .stroke();
      x += width;
    });
    console.log(
      "drawCursoTable - final vertical line x:",
      x,
      "startY:",
      startY,
      "endY:",
      startY - rowHeight * 2
    );
    if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc
      .moveTo(x, startY - rowHeight * 2)
      .lineTo(x, startY)
      .stroke();
  } catch (error) {
    console.error("Error al dibujar las líneas verticales:", error);
  }
};

const drawFechaTable = (
  doc,
  fechaData,
  startX,
  startY,
  rowHeight,
  columnWidths
) => {
  const headers = ["FECHA", "HORA"];
  const padding = 6;

  console.log("drawFechaTable - fechaData:", fechaData);
  console.log(
    "drawFechaTable - startX:",
    startX,
    "startY:",
    startY,
    "rowHeight:",
    rowHeight,
    "columnWidths:",
    columnWidths
  );

  try {
    // Dibujar línea horizontal superior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawFechaTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error("Error al dibujar la línea horizontal superior:", error);
  }

  try {
    // Dibujar encabezados
    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((header, i) => {
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(header, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawFechaTable - header:",
        header,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc.text(
        header,
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
        textY,
        {
          width: width - 2 * padding,
          align: "center",
        }
      );
    });
  } catch (error) {
    console.error("Error al dibujar los encabezados:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior del encabezado
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawFechaTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior del encabezado:",
      error
    );
  }

  try {
    // Dibujar datos
    fechaData.forEach((data, i) => {
      console.log("drawFechaTable - data:", data);
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(data, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawFechaTable - data:",
        data,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc
        .font("Helvetica")
        .fontSize(8)
        .text(
          data,
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          textY,
          {
            width: width - 2 * padding,
            align: "center",
          }
        );
    });
  } catch (error) {
    console.error("Error al dibujar los datos:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawFechaTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior de la tabla:",
      error
    );
  }

  try {
    // Dibujar líneas verticales
    let x = startX;
    columnWidths.forEach((width) => {
      console.log(
        "drawFechaTable - vertical line x:",
        x,
        "width:",
        width,
        "startY:",
        startY,
        "endY:",
        startY - rowHeight * 2
      );
      if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
        throw new Error("Invalid coordinates for lineTo");
      }
      doc
        .moveTo(x, startY - rowHeight * 2)
        .lineTo(x, startY)
        .stroke();
      x += width;
    });
    console.log(
      "drawFechaTable - final vertical line x:",
      x,
      "startY:",
      startY,
      "endY:",
      startY - rowHeight * 2
    );
    if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc
      .moveTo(x, startY - rowHeight * 2)
      .lineTo(x, startY)
      .stroke();
  } catch (error) {
    console.error("Error al dibujar las líneas verticales:", error);
  }
};

const drawLibroFolioTable = (
  doc,
  libroData,
  startX,
  startY,
  rowHeight,
  columnWidths
) => {
  const headers = ["Libro", "Folio"];
  const padding = 6;

  console.log("drawLibroFolioTable - libroData:", libroData);
  console.log(
    "drawLibroFolioTable - startX:",
    startX,
    "startY:",
    startY,
    "rowHeight:",
    rowHeight,
    "columnWidths:",
    columnWidths
  );

  try {
    // Dibujar línea horizontal superior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawLibroFolioTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error("Error al dibujar la línea horizontal superior:", error);
  }

  try {
    // Dibujar encabezados
    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((header, i) => {
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(header, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawLibroFolioTable - header:",
        header,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc.text(
        header,
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
        textY,
        {
          width: width - 2 * padding,
          align: "center",
        }
      );
    });
  } catch (error) {
    console.error("Error al dibujar los encabezados:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior del encabezado
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawLibroFolioTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior del encabezado:",
      error
    );
  }

  try {
    // Dibujar datos
    libroData.forEach((data, i) => {
      console.log("drawLibroFolioTable - data:", data);
      const width = columnWidths[i];
      const textHeight = doc.heightOfString(data, {
        width: width - 2 * padding,
      });
      const textY = startY + (rowHeight - textHeight) / 2;
      console.log(
        "drawLibroFolioTable - data:",
        data,
        "width:",
        width,
        "textHeight:",
        textHeight,
        "textY:",
        textY
      );
      doc
        .font("Helvetica")
        .fontSize(8)
        .text(
          data,
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          textY,
          {
            width: width - 2 * padding,
            align: "center",
          }
        );
    });
  } catch (error) {
    console.error("Error al dibujar los datos:", error);
  }

  startY += rowHeight;

  try {
    // Dibujar línea horizontal inferior de la tabla
    const endX = startX + columnWidths.reduce((a, b) => a + b, 0);
    console.log(
      "drawLibroFolioTable - horizontal line startX:",
      startX,
      "endX:",
      endX,
      "startY:",
      startY
    );
    if (isNaN(endX) || isNaN(startY)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc.lineWidth(0.5).moveTo(startX, startY).lineTo(endX, startY).stroke();
  } catch (error) {
    console.error(
      "Error al dibujar la línea horizontal inferior de la tabla:",
      error
    );
  }

  try {
    // Dibujar líneas verticales
    let x = startX;
    columnWidths.forEach((width) => {
      console.log(
        "drawLibroFolioTable - vertical line x:",
        x,
        "width:",
        width,
        "startY:",
        startY,
        "endY:",
        startY - rowHeight * 2
      );
      if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
        throw new Error("Invalid coordinates for lineTo");
      }
      doc
        .moveTo(x, startY - rowHeight * 2)
        .lineTo(x, startY)
        .stroke();
      x += width;
    });
    console.log(
      "drawLibroFolioTable - final vertical line x:",
      x,
      "startY:",
      startY,
      "endY:",
      startY - rowHeight * 2
    );
    if (isNaN(x) || isNaN(startY) || isNaN(startY - rowHeight * 2)) {
      throw new Error("Invalid coordinates for lineTo");
    }
    doc
      .moveTo(x, startY - rowHeight * 2)
      .lineTo(x, startY)
      .stroke();
  } catch (error) {
    console.error("Error al dibujar las líneas verticales:", error);
  }
};

const numeroALetras = (num) => {
  const unidades = [
    "Aus.",
    "Uno",
    "Dos",
    "Tres",
    "Cuatro",
    "Cinco",
    "Seis",
    "Siete",
    "Ocho",
    "Nueve",
    "Diez",
  ];
  return unidades[num] || num.toString();
};

const generateExamenActaPDF = (data, res) => {
  const doc = new PDFDocument({ size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=examen_acta.pdf");
  doc.pipe(res);

  doc.on("error", (err) => {
    console.error("Error en PDF:", err);
    if (!res.headersSent) {
      res.status(500).send("Error al generar el PDF");
    }
  });

  try {
    // Agregar membrete y encabezados
    addMembrete(doc);
    addHeader(
      doc.font("Helvetica-Bold").fontSize(14),
      "ACTA VOLANTE DE EXAMEN",
      {
        //addHeader(doc.moveUp(1).font('Helvetica-Bold').fontSize(14), 'ACTA VOLANTE DE EXAMEN', {
        align: "center",
        y: MARGEN_TOP_LOCAL,
      }
    );

    // Agregar contenido específico para el acta de examen
    doc.font("Helvetica-Bold").fontSize(10);
    addTextWithMargins(doc, `ESTABLECIMIENTO: IPEM Nº 168 "Diego de Rojas"`, {
      y: MARGEN_TOP + 30,
    });
    addTextWithMargins(
      doc,
      `Condición del Examen: ${data[0].Previa.Condicion.nombre}`,
      {
        y: MARGEN_TOP + 45,
      }
    );
    addTextWithMargins(
      doc,
      `Asignatura: ${data[0].Previa.Materia.nombre} - ${data[0].Previa.Plan.codigo}`,
      { y: MARGEN_TOP + 60 }
    );

    // Agregar "INSCRIPTOS" alineado a la derecha
    const inscriptos = data.length;
    const inscriptosX = 430;
    const inscriptosY = MARGEN_TOP + 52.5;
    const inscriptosWidth = 100;
    const inscriptosHeight = 15;
    doc
      .rect(inscriptosX, inscriptosY, inscriptosWidth, inscriptosHeight)
      .stroke();
    doc.text(`INSCRIPTOS: ${inscriptos}`, inscriptosX + 5, inscriptosY + 5, {
      width: inscriptosWidth - 5,
      align: "center",
    });

    //=======================================================
    console.log("Data:", data[0].Previa.Curso);
    const curso = data[0].Previa.Curso.nombre || "";
    const division = data[0].Previa.Curso.division || "";
    const turno =
      curso === "1º" || curso === "2º" || curso === "3º" ? "Mañana" : "Tarde";
    const libro = data[0].libro || "";
    const folio = data[0].folio || "";

    const fecha = new Date(data[0].FechaExamen.fechaExamen || "");

    // Extraer el día, mes y año
    const dia = String(fecha.getUTCDate()).padStart(2, "0");
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son 0-indexados
    const anio = fecha.getUTCFullYear();

    // Formatear el día en DD/MM/AAAA
    const diaFormateado = `${dia}/${mes}/${anio}`;

    // Extraer la hora y los minutos
    const horas = String(fecha.getUTCHours()).padStart(2, "0");
    const minutos = String(fecha.getUTCMinutes()).padStart(2, "0");

    // Formatear la hora en HH:MM
    const horaFormateada = `${horas}:${minutos}`;

    const cursoData = [curso, division, turno];
    const fechaData = [diaFormateado, horaFormateada];
    const libroData = [libro, folio];

    console.log("Curso Data:", cursoData);
    console.log("Fecha Data:", fechaData);
    console.log("Libro Data:", libroData);

    // Dibujar las tablas justo después de "Asignatura: ..."
    let currentY = MARGEN_TOP + 80;
    drawCursoTable(doc, cursoData, 50, currentY, 17, [60, 60, 60]); // 50+60+60+60 = 230
    drawFechaTable(doc, fechaData, 275, currentY, 17, [60, 60]); // 290+60+60 = 410
    drawLibroFolioTable(doc, libroData, 450, currentY, 17, [60, 60]); // 470+60+60 = 590

    //=======================================================
    // Definir encabezados y filas para la tabla
    const headers = [
      { text: "", colspan: 1 },
      { text: "", colspan: 1 },
      { text: "", colspan: 1 },
      { text: "CALIFICACIÓN", colspan: 3 },
      { text: "", colspan: 1 },
      { text: "", colspan: 1 },
    ];
    const subHeaders = [
      "Nº de Orden",
      "D.N.I.",
      "APELLIDO Y NOMBRE",
      "ESCRITA",
      "ORAL",
      "DEFINITIVA",
    ];
    const rows = data.map((row, index) => {
      leyenda = false;
      if (row.Previa.Alumno) {
        //si row.Calificacion.calificacion = '' o row.Calificacion.calificacion = null o row.Calificacion.calificacion = undefined, entonces leyenda = false, sino leyenda = true
        if (
          row.Calificacion.calificacion === "" ||
          row.Calificacion.calificacion === null ||
          row.Calificacion.calificacion === undefined
        ) {
          console.log("Leyenda:", leyenda);
        } else {
          leyenda = true;
          console.log("Leyenda:", leyenda);
        }

        const notaNumerica = row.Calificacion.calificacion;
        const notaEnLetras =
          notaNumerica === "Aus."
            ? "Aus."
            : notaNumerica
            ? numeroALetras(notaNumerica)
            : "";
        const notaFinal =
          notaNumerica === "Aus."
            ? "Ausente"
            : notaNumerica
            ? `${notaNumerica} (${notaEnLetras})`
            : "";
        return [
          index + 1,
          row.Previa.Alumno.dni,
          `${row.Previa.Alumno.apellidos}, ${row.Previa.Alumno.nombres}`,
          notaNumerica === "Aus." ? "-" : notaNumerica || "", // Nota escrita
          notaNumerica === "Aus." ? "-" : notaNumerica || "", // Nota oral
          notaFinal, // Nota en número y en letras o "Ausente"
        ];
      } else {
        console.error("Faltan datos de Alumno para la fila:", row);
        return ["", "", "", "", "", ""];
      }
    });

    console.log("Rows:", rows);

    // Dibujar la tabla de notas
    currentY += 50; // Ajustar la posición Y para la tabla de notas
    currentY = drawTable(
      doc,
      headers,
      subHeaders,
      rows,
      50,
      currentY,
      17,
      [40, 50, 250, 60, 60, 60] // Anchuras de las columnas total = 520
    );

    currentY += 15; // Ajustar la posición Y para la leyenda de síntesis
    // Agregar contenido específico para el acta de examen
    doc.font("Helvetica").fontSize(10);

    // Calcular aprobados, desaprobados y ausentes
    let aprobados, desaprobados, ausentes;
    if (leyenda === true) {
      aprobados =
        data.filter((row) => row.Calificacion.calificacion >= 7).length || 0;
      desaprobados =
        data.filter(
          (row) =>
            row.Calificacion.calificacion < 7 &&
            row.Calificacion.calificacion !== "Aus."
        ).length || 0;
      ausentes =
        data.filter((row) => row.Calificacion.calificacion === "Aus.").length ||
        0;
    } else {
      aprobados = "_______";
      desaprobados = "_______";
      ausentes = "_______";
    }

    console.log(
      "notaNumerica",
      data.map((row) => row.Calificacion.calificacion),
      "Aprobados:",
      aprobados,
      "Desaprobados:",
      desaprobados,
      "Ausentes:",
      ausentes,
      "Leyenda:",
      leyenda
    );

    addTextWithMargins(
      doc,
      `Se hace constar que sobre un total de ${inscriptos} alumnos, resultaron ${aprobados} aprobados, ${desaprobados} desaprobados y ${ausentes} ausentes.`,
      {
        y: currentY,
        x: 50,
      }
    );

    currentY = 745; // Ajustar la posición Y para las firmas

    doc.lineWidth(0.5).moveTo(50, currentY).lineTo(210, currentY).stroke();
    doc.lineWidth(0.5).moveTo(230, currentY).lineTo(390, currentY).stroke();
    doc.lineWidth(0.5).moveTo(410, currentY).lineTo(570, currentY).stroke();

    currentY += 5;

    addTextWithMargins(doc.font("Helvetica").fontSize(6), `FIRMA VOCAL`, {
      y: currentY,
      x: 110,
    });
    addTextWithMargins(doc.font("Helvetica").fontSize(6), `FIRMA PRESIDENTE`, {
      y: currentY,
      x: 282,
    });
    addTextWithMargins(doc.font("Helvetica").fontSize(6), `FIRMA VOCAL`, {
      y: currentY,
      x: 470,
    });

    currentY += 10;

    addTextWithMargins(doc.font("Helvetica").fontSize(6), `Aclar.:`, {
      y: currentY,
      x: 50,
    });

    addTextWithMargins(doc.font("Helvetica").fontSize(6), `Aclar.:`, {
      y: currentY,
      x: 230,
    });

    addTextWithMargins(doc.font("Helvetica").fontSize(6), `Aclar.:`, {
      y: currentY,
      x: 410,
    });

    doc.end();
  } catch (error) {
    console.error("Error al procesar el PDF:", error);
    if (!res.headersSent) {
      res.status(500).send("Error al procesar el PDF");
    }
  }
};

module.exports = { generateExamenActaPDF };
