const PDFDocument = require("pdfkit");

const {
  addMembrete,
  addHeader,
  addTextWithMargins,
  MARGEN_TOP,
} = require("./pdfService");

//const MARGEN_TOP_LOCAL = MARGEN_TOP - 28.35;
const MARGEN_TOP_LOCAL = MARGEN_TOP - 20;

const drawTable = (
  doc, // El documento PDF en el que estamos trabajando
  headers, // Los encabezados principales de la tabla
  rows, // Las filas de datos de la tabla
  startX, // La posición X inicial de la tabla
  startY, // La posición Y inicial de la tabla
  rowHeight, // La altura de cada fila
  columnWidths, // Los anchos de cada columna
  padding = 6 // El padding (espacio) dentro de cada celda
) => {
  if (!Array.isArray(columnWidths)) {
    throw new Error("columnWidths debe ser un array");
  }

  let y = startY; // La posición Y actual, comenzando en startY

  // Dibujar línea horizontal superior de la tabla
  doc
    .lineWidth(0.5) // Establecer el grosor de la línea
    .moveTo(startX, y) // Mover a la posición inicial de la línea
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
    .stroke(); // Aplicar el trazo

  // Dibujar encabezados principales con fondo gris
  doc.font("Helvetica-Bold"); // Establecer la fuente, tamaño del texto y color

  headers.forEach((header, i) => {
    const width = columnWidths[i];
    const textHeight = doc.heightOfString(header.text, {
      width: width - 2 * padding,
    });
    const textY = y + (rowHeight - textHeight) / 2; // Centrar verticalmente el texto en la celda
    doc
      .fontSize(7)
      .fillColor("white")
      .rect(
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        width,
        rowHeight
      )
      .fill("#0000FF");
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor("white")
      .text(
        header.text,
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding,
        textY,
        { width: width - 2 * padding, align: "center" } // Alineación centrada
      );
  });

  y += rowHeight; // Mover la posición Y hacia abajo para la siguiente fila

  // Dibujar línea horizontal inferior del encabezado
  doc
    .lineWidth(0.5) // Establecer el grosor de la línea
    .moveTo(startX, y) // Mover a la posición inicial de la línea
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
    .stroke(); // Aplicar el trazo

  // Dibujar filas con diseño cebrado
  rows.forEach((row, rowIndex) => {
    const isEvenRow = rowIndex % 2 === 0;
    if (!isEvenRow) {
      doc
        .rect(
          startX,
          y,
          columnWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill("#00FFFF"); // Color de fondo para filas pares
    }

    row.forEach((cell, i) => {
      const width = columnWidths[i]; // Obtener el ancho de la columna
      const textHeight = doc.heightOfString(cell, {
        width: width - 2 * padding,
      }); // Calcular la altura del texto
      const textY = y + (rowHeight - textHeight) / 2; // Centrar verticalmente el texto en la celda
      doc.fillColor("black").text(
        cell, // El texto de la celda
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + padding, // La posición X del texto
        textY, // La posición Y del texto
        { width: width - 2 * padding, align: "center" } // Opciones de formato del texto: ancho y alineación
      );
    });
    y += rowHeight; // Mover la posición Y hacia abajo para la siguiente fila

    // Dibujar línea horizontal inferior de la fila
    doc
      .lineWidth(0.5) // Establecer el grosor de la línea
      .moveTo(startX, y) // Mover a la posición inicial de la línea
      .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y) // Dibujar la línea hasta el final de la tabla
      .stroke(); // Aplicar el trazo
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

const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Formato 24 horas
    timeZone: "UTC", // Asegurarse de que no se ajuste la zona horaria
  });
  return formattedDate.replace(",", "");
};

const generatePermisoExamenPDF = (data, res) => {
  console.log(
    "Datos recibidos para generar el PDF: (generatePermisoExamenPDF)"
  );
  console.table(data);
  console.log("Previas:");
  console.table(data[0].Previa);
  console.log("Fechas de Examen:");
  console.table(data[0].FechaExamen);

  const doc = new PDFDocument({ size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=permiso_examen.pdf"
  );
  doc.pipe(res);

  addMembrete(doc);
  console.log("margenes", MARGEN_TOP_LOCAL);
  addHeader(
    doc.moveDown(1).font("Helvetica-Bold").fontSize(14),
    "PERMISO DE EXAMEN",
    {
      align: "center",
      y: MARGEN_TOP_LOCAL + 90, // Incrementa este valor para bajar el título
    }
  );

  // Agrega contenido específico para el permiso de examen
  doc
    .font("Helvetica")
    .fontSize(10)
    .moveDown(1)
    .text(
      `Conste por la presente que ${data[0].Previa.Alumno.apellidos}, ${data[0].Previa.Alumno.nombres} - DNI: ${data[0].Previa.Alumno.dni}, está habilitado/a para rendir las asignaturas que se detallan a continuación, lo que hizo en las fechas señaladas:`,
      { align: "justify", y: MARGEN_TOP_LOCAL + 90 } // Incrementa este valor para bajar el texto
    );

  const rows = data.map((row, index) => {
    leyenda = false;
    if (row.Previa.Alumno) {
      //si row.Calificacion.calificacion = '' o row.Calificacion.calificacion = null o row.Calificacion.calificacion = undefined, entonces leyenda = false, sino leyenda = true
      if (
        row.Previa.Calificacion.calificacion === "" ||
        row.Previa.Calificacion.calificacion === null ||
        row.Previa.Calificacion.calificacion === undefined
      ) {
        console.log("Leyenda:", leyenda);
      } else {
        leyenda = true;
        console.log("Leyenda:", leyenda);
      }

      const notaNumerica = row.Previa.Calificacion.calificacion; // Obtener la nota numérica
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
        row.Previa.Materia.nombre,
        row.Previa.Curso.nombre,
        row.Previa.Condicion.nombre,
        formatDate(row.FechaExamen.fechaExamen), // Fecha de examen
        notaFinal, // Nota en número y en letras o "Ausente"
      ];
    } else {
      console.error("Faltan datos de Alumno para la fila:", row);
      return ["", "", "", "", "", ""];
    }
  });

  console.log("Rows:", rows);
  let currentY = MARGEN_TOP + 20;
  console.log("Current Y:", currentY);
  const headers = [
    { text: "Nº", colspan: 1 },
    { text: "ESPACIO CURRICULAR", colspan: 1 },
    { text: "CURSO", colspan: 1 },
    { text: "CONDICIÓN", colspan: 1 },
    { text: "FECHA Y HORA", colspan: 1 },
    { text: "CALIFICACIÓN", colspan: 1 },
    { text: "FIRMA PRES. DE MESA", colspan: 1 },
  ];

  currentY += 50; // Ajustar la posición Y para la tabla de notas
  currentY = drawTable(
    doc,
    headers,
    rows,
    50,
    (currentY += 5),
    23, //17,
    [25, 180, 40, 60, 70, 70, 80] // Anchuras de las columnas total = 520
  );

  // Agregar fecha actual debajo de la tabla alineada a la derecha
  let fechaActual = new Date();
  fechaActual = fechaActual.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(`Villa General Belgrano, ${fechaActual}`, 200, currentY + 20, {
      align: "right",
    });

  // Agregar leyenda IMPORTANTE
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("IMPORTANTE:", 75, (currentY += 40), { align: "left" });
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Para acceder a cada Mesa de Examen debe presentar este documento en conjunto con su DNI. SIN EXCEPCIÓN.",
      75,
      (currentY += 15),
      { align: "left" }
    );
  console.log("Current Y:", currentY);
  doc.end();
};

module.exports = { generatePermisoExamenPDF };
