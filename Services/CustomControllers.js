// Services/CustomControllers.js
const logger = require("../Config/logger");
const { getResumenInscriptosExamenes } = require("./pdf/dataService");
const generarPDF = require("./pdf/generarResumenInscriptosPDF");

exports.getResumenInscriptosExamenes = async (req, res) => {
  try {
    const { id_turno, condiciones } = req.body;

    if (!id_turno || !Array.isArray(condiciones)) {
      logger.warn(
        "Solicitud inválida: faltan parámetros o condiciones no es array"
      );
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    logger.info(
      `Procesando resumen para turno ${id_turno} con condiciones: ${JSON.stringify(
        condiciones
      )}`
    );

    const { resumen, turno } = await getResumenInscriptosExamenes(
      id_turno,
      condiciones
    );

    if (!resumen.length) {
      logger.info(
        `No se encontraron inscriptos para el turno ${id_turno} con las condiciones seleccionadas`
      );
      return res.status(404).json({ error: "No se encontraron inscriptos" });
    }

    const pdfBuffer = await generarPDF(resumen, turno);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ResumenInscriptos.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    logger.error("Error en getResumenInscriptosExamenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
