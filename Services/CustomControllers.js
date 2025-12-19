// Services/CustomControllers.js
const db = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const logger = require("../Config/logger");
const { getResumenInscriptosExamenes } = require("./pdf/dataService");
const {
  alumnosPorCurso,
} = require("../Controllers/InscripcionCurso.controller");
const RiesgoServices = require("../Services/RiesgoServices");
const InscripcionCursoServices = require("../Services/InscripcionCursoServices");

const generarPDF = require("./pdf/resumenInscriptosExamenes");

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

exports.getResumenRiesgo = async (req, res) => {
  console.log("Llega a CustomControllers - ResumenRiesgo");
  console.log("Body:", req.body);

  try {
    const { id_ciclo, id_curso, id_division } = req.body;
    if (!id_ciclo || !id_curso || !id_division) {
      logger.warn("Solicitud inválida: faltan parámetros");
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    logger.info(
      `Procesando resumen de riesgo para ciclo ${id_ciclo}, curso ${id_curso} y división ${id_division}`
    );

    // 1. Obtener los alumnos del curso (Usando el nuevo Service)
    const alumnos = await InscripcionCursoServices.getAlumnosInscriptos({
      id_ciclo,
      id_curso,
      id_division,
    });

    if (!alumnos || alumnos.length === 0) {
      logger.info(`No se encontraron alumnos para el curso.`);
      return res.status(404).json({
        error: "No se encontraron alumnos en el curso/división especificada.",
      });
    }

    // Extraer IDs para la consulta de previas
    const alumnoIds = alumnos.map((alumno) => alumno.id_alumno);
    console.log("IDs de alumnos obtenidos:", alumnoIds);
    // 2. Obtener las previas no aprobadas (Usando el Service de Riesgo)
    const resumen = await RiesgoServices.getPreviasNoAprobadasPorAlumnos(
      alumnoIds,
      id_curso,
      id_ciclo
    );

    // 3. Devolver el resumen
    res.json(resumen);
  } catch (error) {
    logger.error("Error en getResumenRiesgo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getPreviasColoquioSummary = async (req, res) => {
  try {
    // Buscamos registros donde id_calificacion sea NULL o 0 (que a menudo es el valor para FALSE/PENDIENTE en bases de datos)
    const previasPendientes = await db.Previa.findAll({
      where: {
        // Op.or permite buscar por múltiples condiciones
        [Op.or]: [
          { id_calificacion: { [Op.is]: null } }, // Condición 1: id_calificacion es NULL
          { id_calificacion: 0 }, // Condición 2: id_calificacion es 0 (FALSE/No Calificado)
        ],
      },
      // Incluimos la Condición para ver de qué tipo de previa se trata
      include: [
        {
          model: db.Condicion,
          attributes: ["nombre"],
          as: "Condicion",
          required: false,
        },
      ],
      attributes: [
        "id_previa",
        "id_alumno",
        "id_materia",
        "id_condicion",
        "id_calificacion",
      ], // Seleccionamos las columnas útiles
    });

    // 2. Procesar y contar los resultados
    let totalGeneral = previasPendientes.length;
    let conteoPorCondicion = {};

    // Creamos la lista de IDs para el análisis
    const idsPreviasPendientes = [];

    previasPendientes.forEach((previa) => {
      const nombreCondicion = previa.Condicion
        ? previa.Condicion.nombre
        : "SIN CONDICIÓN";

      if (!conteoPorCondicion[nombreCondicion]) {
        conteoPorCondicion[nombreCondicion] = 0;
      }
      conteoPorCondicion[nombreCondicion]++;

      idsPreviasPendientes.push(previa.id_previa); // Recolectamos los IDs
    });

    // 3. Devolver el resumen
    return res.status(200).json({
      message: "Listado y conteo de previas con calificación NULL o 0.",
      total_pendientes: totalGeneral,
      conteo_por_condicion: conteoPorCondicion,
      // Opcional: Para verificar, puedes devolver los IDs de los coloquios pendientes.
      // ids_previas_pendientes: idsPreviasPendientes
    });
  } catch (error) {
    console.error("Error al obtener previas pendientes:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
  //};
};

exports.getConteoColoquiosRaw = async (req, res) => {
  try {
    const INCONSISTENCIAS = await db.Inscripcion.findAll({
      // 1. Unir con FechaExamen (para obtener la condición de Coloquio)
      include: [
        {
          model: db.FechaExamen,
          as: "FechaExamen", // Asume el alias 'FechaExamen'
          // Filtro clave: El examen programado era un COLOQUIO
          where: {
            id_condicion: 4,
          },
          required: true,
        },
        // 2. Unir con Previas (para verificar la calificación y la inconsistencia)
        {
          model: db.Previa,
          as: "Previa", // Asume el alias 'Previa'
          attributes: ["id_calificacion", "id_condicion"],
          required: true,

          // Filtros de Inconsistencia en la tabla Previa:
          where: {
            // La calificación es baja/desaprobatoria O es NULL
            [Op.or]: [
              { id_calificacion: { [Op.lte]: 8 } },
              { id_calificacion: { [Op.is]: null } },
            ],
            // Y la condición de la previa NO ES Coloquio (4). Buscamos 1, 2, 3...
            id_condicion: { [Op.ne]: 4 },
          },
        },
      ],
      attributes: ["id_inscripcion", "id_previa"],
    });

    const totalInconsistencias = INCONSISTENCIAS.length;

    // 3. Devolver el resultado de la auditoría
    return res.status(200).json({
      message: "Auditoría de consistencia de estado de Coloquios (3 Tablas).",
      auditoria_exitosa:
        totalInconsistencias > 0
          ? "⚠️ INCONSISTENCIAS ENCONTRADAS"
          : "✅ DATOS CONSISTENTES",
      registros_a_corregir: totalInconsistencias,
      ejemplo_inconsistencias: INCONSISTENCIAS.slice(0, 10).map((i) => ({
        // Devolvemos una muestra
        id_inscripcion: i.id_inscripcion,
        id_previa: i.id_previa,
        condicion_examen: 4, // Condición que debería tener
        condicion_actual_previa: i.Previa.id_condicion, // Condición que tiene (ej: 1)
        calificacion: i.Previa.id_calificacion,
      })),
    });
  } catch (error) {
    console.error("Error al auditar inconsistencias:", error);
    return res.status(500).json({
      error: "Error interno del servidor al realizar la auditoría.",
      details: error.message,
    });
  }
};
