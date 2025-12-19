// RiesgoServices.js (CORREGIDO)

const db = require("../Models");
const { Op } = require("sequelize");
const logger = require("../Config/logger");
const { required } = require("nodemon/lib/config");

/**
 * Obtiene las previas no aprobadas para una lista de alumnos.
 * @param {Array<number>} alumnoIds - Array de IDs de alumnos.
 * @returns {Promise<Array<object>>} - Lista de alumnos con sus previas no aprobadas.
 */
// **NOTA:** Deberías pasar el id de la Condición 'COLOQUIO' si el curso actual debe excluirse por esa condición.
// Por simplicidad, asumimos que idCondicionColoquio se obtiene aquí o se recibe como parámetro.
exports.getPreviasNoAprobadasPorAlumnos = async (
  alumnoIds,
  id_curso,
  id_ciclo
) => {
  // 🛑 ATENCIÓN: Por ahora, hardcodearemos una asunción de ID.
  // Lo correcto es buscar el ID de Condicion='COLOQUIO' antes de la consulta.
  // Ejemplo: const idCondicionColoquio = await db.Condicion.findOne({where: { nombre: 'COLOQUIO' }})

  // Si no puedes obtenerlo, la solución más simple es filtrar en el array después (menos eficiente).
  // Usaremos la solución de consulta negada.

  console.log("Llega a RiesgoServices - getPreviasNoAprobadasPorAlumnos");
  console.log("IDs de alumnos recibidos:", alumnoIds);

  try {
    if (!alumnoIds || alumnoIds.length === 0) {
      return [];
    }

    // Si debes filtrar en el backend sin conocer el ID de Condicion de Coloquio:
    const idCondicionColoquioObj = await db.Condicion.findOne({
      where: { nombre: "COLOQUIO" },
      attributes: ["id_condicion"],
      raw: true,
    });

    const idCondicionColoquio = idCondicionColoquioObj
      ? idCondicionColoquioObj.id_condicion
      : null;

    // --------------------------------------------------------------------------------
    // 🛑 LÓGICA CLAVE: Negamos la condición de exclusión. Queremos:
    // TODAS las previas (Previa.id_previa)
    // EXCEPTO (Op.not):
    //   [Previa.id_curso = id_curso (actual) Y Previa.id_condicion = idCondicionColoquio]
    // --------------------------------------------------------------------------------

    const previas = await db.Previa.findAll({
      where: {
        // 1. Filtramos por los alumnos que estamos analizando
        id_alumno: {
          [Op.in]: alumnoIds,
        },

        // ✅ FILTRO DE EXCLUSIÓN: Queremos todas las previas
        // que NO cumplan la condición de pertenecer al curso actual y el id_ciclo sea diferente al actual
        [Op.not]: {
          [Op.and]: [
            { id_curso: id_curso },
            { id_ciclo: { [Op.ne]: id_ciclo } },
          ],
        },
      },

      // 2. Incluimos las relaciones para el reporte
      include: [
        {
          model: db.Alumno,
          as: "Alumno",
          attributes: ["id_alumno", "dni", "apellidos", "nombres"],
        },
        {
          model: db.Materia,
          as: "Materia",
          attributes: ["nombre"],
        },
        {
          model: db.Condicion,
          as: "Condicion",
          attributes: ["nombre"],
        },
        {
          model: db.Curso,
          as: "Curso",
          attributes: ["id_curso", "nombre"],
          // ✅ ¡Eliminamos el filtro "where" de aquí! Ahora está en la cláusula where principal.
        },
        {
          model: db.CicloLectivo,
          as: "CicloLectivo",
          attributes: ["id_ciclo", "anio"],
        },
        // ✅ 3. FILTRO POR CALIFICACIÓN REPROBADA
        {
          model: db.Calificacion,
          as: "Calificacion",
          attributes: [],
          required: true,
          where: {
            aprobado: false, // La calificación asociada debe indicar que NO fue aprobada.
          },
        },
      ],
    });

    console.log("Previas no aprobadas encontradas:", previas.length);

    // El resto del código de mapeo y ordenamiento es correcto:
    // ... (Tu lógica de resumenPorAlumno y ordenamiento aquí) ...

    const resumenPorAlumno = {};
    // ... (Tu código de formateo) ...
    previas.forEach((previa) => {
      const id = previa.Alumno.id_alumno;
      if (!resumenPorAlumno[id]) {
        resumenPorAlumno[id] = {
          id_alumno: id,
          dni: previa.Alumno.dni,
          apellidos: previa.Alumno.apellidos,
          nombres: previa.Alumno.nombres,
          previasPendientes: [],
        };
      }
      resumenPorAlumno[id].previasPendientes.push({
        materia: previa.Materia.nombre,
        anioMateria: previa.Curso.nombre,
        condicion: previa.Condicion.nombre,
        cicloLectivo: previa.CicloLectivo.anio,
        estado: "Pendiente",
      });
    });

    const resumenArray = Object.values(resumenPorAlumno);
    // 1. ORDENAR LOS ALUMNOS
    resumenArray.sort((a, b) => {
      if (a.apellidos < b.apellidos) return -1;
      if (a.apellidos > b.apellidos) return 1;
      if (a.nombres < b.nombres) return -1;
      if (a.nombres > b.nombres) return 1;
      return 0;
    });

    // 2. ORDENAR LAS PREVIAS DENTRO DE CADA ALUMNO
    resumenArray.forEach((alumno) => {
      alumno.previasPendientes.sort((a, b) => {
        if (a.anioMateria < b.anioMateria) return -1;
        if (a.anioMateria > b.anioMateria) return 1;
        if (a.condicion < b.condicion) return -1;
        if (a.condicion > b.condicion) return 1;
        if (a.materia < b.materia) return -1;
        if (a.materia > b.materia) return 1;
        return 0;
      });
    });

    return resumenArray; // Retornar el array, no Object.values(resumenArray) dos veces.
  } catch (error) {
    logger.error("Error en getPreviasNoAprobadasPorAlumnos:", error);
    throw new Error(
      "Error crítico al consultar previas. Revise la lógica de filtro."
    );
  }
};
