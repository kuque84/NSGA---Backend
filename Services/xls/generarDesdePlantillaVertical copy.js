const XlsxPopulate = require("xlsx-populate");
const exceljs = require("exceljs");
const path = require("path");
const logger = require("../../Config/logger");

const generarDesdePlantillaVertical = async (resumenData, turno) => {
  try {
    const plantillaPath = path.resolve("src/Templates/Plantilla Vertical.xlsx");
    const workbook = await XlsxPopulate.fromFileAsync(plantillaPath);
    const sheet = workbook.sheet(0);
    /*
    // Configurar márgenes
    sheet.pageSetup({ marginBottom: 4.5 });
*/ // Título del documento en B1 "Resumen de Inscriptos ${turno.nombre} - ${turno.CicloLectivo.anio}"
    sheet
      .cell("B1")
      .value(
        `Resumen de Inscriptos ${turno.nombre} - ${turno.CicloLectivo.anio}`
      );

    // Encabezados dinámicos en B3 en adelante
    const headers = [
      "Nº",
      "APELLIDO",
      "NOMBRE",
      "ESPACIO CURRICULAR",
      "CONDICIÓN",
      "CURSO",
      "FECHA HORA",
      "Cal",
      "A",
      "L",
      "F",
    ];
    headers.forEach((header, i) => {
      const cell = sheet.cell(3, i + 2);
      cell.value(header);
      cell.style({
        bold: true,
        horizontalAlignment: "center",
        fill: "DDDDDD",
        border: true,
      });
    });

    // Insertar datos desde B4
    let rowIndex = 4;
    let aprobados = 0;
    let desaprobados = 0;
    let ausentes = 0;

    resumenData.forEach((item, index) => {
      const values = [
        index + 1,
        item.Apellido_Alumno,
        item.Nombre_Alumno,
        item.Nombre_Materia,
        item.Condicion,
        item.Nombre_Curso,
        item.Fecha_Examen,
        item.Nota,
        item.Aprobado,
        item.L,
        item.F,
      ];

      values.forEach((val, colIndex) => {
        const cell = sheet.cell(rowIndex, colIndex + 2);
        cell.value(val);
        cell.style({
          horizontalAlignment: "center",
          border: true,
        });

        // Formato de fecha
        if (colIndex === 6 && typeof val === "object" && val instanceof Date) {
          cell.style({ numberFormat: "dd/mm/yy hh:mm" });
        }
      });

      // Contadores

      if (item.Nota === "Aus.") {
        ausentes++;
      } else {
        const notaNum =
          typeof item.Nota === "string" ? Number(item.Nota) : item.Nota;
        if (!isNaN(notaNum)) {
          if (notaNum >= 7) aprobados++;
          else desaprobados++;
        }
      }

      rowIndex++;
    });

    const total = aprobados + desaprobados + ausentes;
    const resumenStart = rowIndex + 2;

    // Insertar resumen
    const resumen = [
      ["Aprobados", aprobados],
      ["Desaprobados", desaprobados],
      ["Ausentes", ausentes],
      ["TOTAL", total],
    ];

    resumen.forEach(([label, count], i) => {
      sheet
        .cell(resumenStart + i, 3)
        .value(label)
        .style({
          horizontalAlignment: "center",
          border: true,
        });
      sheet
        .cell(resumenStart + i, 4)
        .value(count)
        .style({
          horizontalAlignment: "center",
          border: true,
        });
      sheet
        .cell(resumenStart + i, 5)
        .value(label === "TOTAL" ? 1 : +(count / total).toFixed(3))
        .style({
          horizontalAlignment: "center",
          border: true,
          //formato en porcentaje
          numberFormat: "0.00%",
        });
    });

    //autoajustar columnas
    //sheet.autoFit();

    //Ocultar columna J
    sheet.column("J").hidden(true);

    //Insertar codigo VBA en la hoja cells.entirecolumn.autofit

    /*
    // Insertar gráfico de torta
    const chart = workbook.addChart({
      type: "pie",
      title: "Resumen de Condiciones",
      data: {
        categories: resumen.slice(0, 3).map(([label]) => label),
        values: resumen.slice(0, 3).map(([, count]) => count),
      },
      position: {
        sheet: sheet.name(),
        cell: `H${resumenStart}`,
      },
    });
*/
    const buffer = await workbook.outputAsync();
    return buffer;
  } catch (error) {
    logger.error("Error al generar planilla desde plantilla vertical:", error);
    throw error;
  }
};

module.exports = generarDesdePlantillaVertical;
