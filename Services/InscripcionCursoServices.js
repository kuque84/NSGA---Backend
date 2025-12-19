const db = require("../Models");
const logger = require("../Config/logger");

/**
 * Obtiene la lista de alumnos inscritos en un curso/division para un ciclo específico.
 * @param {object} params - Contiene id_ciclo, id_curso, id_division.
 * @returns {Promise<Array<object>>} - Lista de objetos de Alumno.
 */
exports.getAlumnosInscriptos = async ({ id_ciclo, id_curso, id_division }) => {
  const cicloId = parseInt(id_ciclo);
  const cursoId = parseInt(id_curso);
  const divisionId = parseInt(id_division);

  try {
    const inscripciones = await db.InscripcionCurso.findAll({
      where: {
        id_ciclo: cicloId,
        id_curso: cursoId,
        id_division: divisionId,
      },
      attributes: ["id_alumno"], // Solo necesitamos el ID del alumno
      include: [
        {
          model: db.Alumno,
          as: "Alumno",
          attributes: ["id_alumno", "dni", "apellidos", "nombres"],
          required: true,
        },
      ],
    });

    if (!inscripciones || inscripciones.length === 0) {
      console.log("No se encontraron inscripciones para los parámetros dados.");
      return [];
    }

    // Devolvemos una lista limpia de objetos de Alumno
    console.log("Devolviendo id_alumno encontrados:", inscripciones.length);
    return inscripciones.map((insc) => insc.Alumno);
  } catch (error) {
    logger.error("Error en getAlumnosInscriptos:", error);
    throw new Error("Error al obtener alumnos inscritos por curso.");
  }
};
