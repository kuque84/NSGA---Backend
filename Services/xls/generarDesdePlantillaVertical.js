const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const logger = require("../../Config/logger");

const generarDesdePlantillaVertical = async (resumenData, turno) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Resumen");

    // Configurar impresión A4 sin márgenes
    sheet.pageSetup = {
      paperSize: 9, // A4
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        header: 0,
        footer: 0,
      },
    };

    // Encabezados en fila 3, desde columna B (índice 2)
    const headers = [
      "Nº",
      "APELLIDO",
      "NOMBRE",
      "DNI",
      "ESPACIO CURRICULAR",
      "FECHA HORA",
      "CONDICIÓN",
      "CURSO",
      "Cal",
      "A",
      "L",
      "F",
    ];
    sheet.addRow([]);
    sheet.addRow([]);
    const headerRow = sheet.getRow(3);
    headers.forEach((header, i) => {
      headerRow.getCell(i + 2).value = header;
      headerRow.getCell(i + 2).font = { bold: true };
      headerRow.getCell(i + 2).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      headerRow.getCell(i + 2).alignment = { horizontal: "center" };
    });
    headerRow.commit();

    // Insertar datos desde fila 4, columna B
    let aprobados = 0,
      desaprobados = 0,
      ausentes = 0;
    resumenData.forEach((item, index) => {
      const nota = item.Nota;
      const notaNum = typeof nota === "string" ? Number(nota) : nota;

      if (nota === "Aus.") ausentes++;
      else if (!isNaN(notaNum)) {
        if (notaNum >= 7) aprobados++;
        else desaprobados++;
      }

      const row = sheet.getRow(index + 4);
      const values = [
        index + 1,
        item.Apellido_Alumno,
        item.Nombre_Alumno,
        item.DNI,
        item.Nombre_Materia,
        item.Fecha_Examen,
        item.Condicion,
        item.Nombre_Curso,
        item.Nota,
        item.Aprobado,
        item.L,
        item.F,
      ];
      values.forEach((val, i) => {
        row.getCell(i + 2).value = val;
        row.getCell(i + 2).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        row.getCell(i + 2).alignment = { horizontal: "center" };
      });
      row.commit();
    });

    // Autoajustar columnas simulando AutoFit
    for (let i = 1; i <= sheet.columnCount; i++) {
      const column = sheet.getColumn(i);
      let maxLength = 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        let displayValue = "";
        if (cell.type === ExcelJS.ValueType.Date) {
          displayValue = cell.value.toLocaleDateString("es-AR");
        } else if (cell.type === ExcelJS.ValueType.RichText) {
          displayValue = cell.value.richText.map((rt) => rt.text).join("");
        } else {
          displayValue = cell.value ? cell.value.toString() : "";
        }

        const length = displayValue.length;
        if (length > maxLength) maxLength = length;
      });

      column.width = maxLength + 2;
    }

    // Insertar resumen
    const resumenStart = sheet.rowCount + 2;
    const total = aprobados + desaprobados + ausentes;
    const resumen = [
      ["Aprobados", aprobados],
      ["Desaprobados", desaprobados],
      ["Ausentes", ausentes],
    ];

    resumen.forEach(([label, count], i) => {
      sheet.getCell(`C${resumenStart + i}`).value = label;
      sheet.getCell(`D${resumenStart + i}`).value = count;
      sheet.getCell(`E${resumenStart + i}`).value =
        total > 0 ? count / total : 0;
      sheet.getCell(`E${resumenStart + i}`).numFmt = "0.00%";
      sheet.getCell(`C${resumenStart + i}`).font = { bold: true };
      sheet.getCell(`C${resumenStart + i}`).alignment = {
        horizontal: "center",
      };
      sheet.getCell(`C${resumenStart + i}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      sheet.getCell(`D${resumenStart + i}`).font = { bold: true };
      sheet.getCell(`D${resumenStart + i}`).alignment = {
        horizontal: "center",
      };
      sheet.getCell(`D${resumenStart + i}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      sheet.getCell(`E${resumenStart + i}`).font = { bold: true };
      sheet.getCell(`E${resumenStart + i}`).alignment = {
        horizontal: "center",
      };
      sheet.getCell(`E${resumenStart + i}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    sheet.getCell(`C${resumenStart + 3}`).value = "TOTAL";
    sheet.getCell(`D${resumenStart + 3}`).value = total;
    sheet.getCell(`E${resumenStart + 3}`).value = 1;
    sheet.getCell(`E${resumenStart + 3}`).numFmt = "0.00%";

    // Aplicar formato personalizado a las fechas en columna F (índice 6)
    for (let i = 4; i <= sheet.rowCount; i++) {
      const cell = sheet.getRow(i).getCell(6);
      if (cell.value instanceof Date) {
        cell.numFmt = "dd/mm/yy HH:mm";
      }
    }

    // Calcular ancho total de columnas desde A hasta última con datos
    let totalWidth = 0;

    // Ocultar columna K (índice 11)
    sheet.getColumn(11).hidden = true;

    // Columna A con ancho x en unidades (1 cm = 3.78 puntos, 1 punto ≈ 2 unidades)
    sheet.getColumn(1).width = 13.23;

    for (let i = 1; i <= sheet.columnCount; i++) {
      totalWidth += sheet.getColumn(i).width || 20;
    }

    const imageWidthPx = totalWidth * 7.5; // 1 unidad ≈ 7.5 px

    const aspectRatio = 29.7 / 21;
    const imageHeightPx = imageWidthPx * aspectRatio;

    // Insertar imagen PNG como membrete
    const imagePath = path.resolve("src/Img/MEMBRETE - 2024 - completo.png");
    if (fs.existsSync(imagePath)) {
      const imageId = workbook.addImage({
        buffer: fs.readFileSync(imagePath),
        extension: "png",
      });

      sheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: imageWidthPx, height: imageHeightPx },
        editAs: "oneCell",
      });
    }

    // Configurar encabezado
    sheet.getCell(
      "B1"
    ).value = `Resumen de Inscriptos ${turno.nombre} - ${turno.CicloLectivo.anio}`;
    sheet.getCell("B1").style = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center", vertical: "bottom" },
    };
    sheet.getRow(1).height = 189; // 5 cm (1 cm = 37.8 puntos)

    // Obtener índice de la última columna con datos
    // const lastColIndex = sheet.columnCount;

    // Obtener letra de la última columna
    // const lastColLetter = ExcelJS.utils.getExcelAlpha(lastColIndex);

    // Combinar celdas desde B1 hasta última columna
    sheet.mergeCells(`B1:M1`);

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error("Error al generar planilla con ExcelJS:", error);
    throw error;
  }
};

module.exports = generarDesdePlantillaVertical;
