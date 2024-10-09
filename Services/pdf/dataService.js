const db = require('../../Models'); // Importamos los modelos de la base de datos
const { Op } = db.Sequelize;

const getAlumnoData = async (id_alumno) => {
  try {
    const alumno = await db.Alumno.findOne({ where: { id_alumno } });
    if (!alumno) throw new Error('Alumno no encontrado');
    return alumno;
  } catch (error) {
    console.error('Error al obtener los datos del alumno:', error);
    throw error;
  }
};

const getCicloLectivoData = async (id_ciclo) => {
  try {
    const cicloLectivo = await db.CicloLectivo.findOne({ where: { id_ciclo } });
    if (!cicloLectivo) throw new Error('Ciclo lectivo no encontrado');
    return cicloLectivo;
  } catch (error) {
    console.error('Error al obtener los datos del ciclo lectivo:', error);
    throw error;
  }
};

const getPreviaData = async (id_alumno) => {
  try {
    const previas = await db.Previa.findAll({
      where: { id_alumno },
      include: [
        {
          model: db.Alumno,
          attributes: ['dni', 'apellidos', 'nombres'],
          as: 'Alumno',
        },
        {
          model: db.Curso,
          attributes: ['nombre'],
          as: 'Curso',
        },
        {
          model: db.Materia,
          attributes: ['nombre'],
          as: 'Materia',
        },
        {
          model: db.Condicion,
          attributes: ['nombre'],
          as: 'Condicion',
        },
        {
          model: db.Plan,
          attributes: ['codigo'],
          as: 'Plan',
        },
        {
          model: db.CicloLectivo,
          attributes: ['anio'],
          as: 'CicloLectivo',
        },
        {
          model: db.Calificacion,
          attributes: ['calificacion', 'aprobado'],
          as: 'Calificacion',
        },
      ],
    });

    return previas.map((previa) => ({
      alumno: `${previa.Alumno.apellidos}, ${previa.Alumno.nombres}`,
      dni: previa.Alumno.dni,
      materia: previa.Materia.nombre,
      curso: previa.Curso.nombre,
      cicloLectivo: previa.CicloLectivo.anio,
      plan: previa.Plan.codigo,
      condicion: previa.Condicion.nombre,
      aprobado: previa.Calificacion.aprobado,
      calificacion: previa.Calificacion.calificacion,
    }));
  } catch (error) {
    console.error('Error al obtener los datos de las previas:', error);
    throw error;
  }
};

const getRacData = async (id_alumno, id_ciclo) => {
  try {
    const alumno = await getAlumnoData(id_alumno);
    const cicloLectivo = await getCicloLectivoData(id_ciclo);
    const previas = await getPreviaData(id_alumno);

    const examenes = await db.Inscripcion.findAll({
      include: [
        {
          model: db.Previa,
          as: 'Previa',
          where: { id_alumno },
          include: [
            {
              model: db.Alumno,
              attributes: ['dni', 'apellidos', 'nombres'],
              as: 'Alumno',
            },
            {
              model: db.Curso,
              attributes: ['nombre'],
              as: 'Curso',
            },
            {
              model: db.Materia,
              attributes: ['nombre'],
              as: 'Materia',
            },
            {
              model: db.Condicion,
              attributes: ['nombre'],
              as: 'Condicion',
            },
            {
              model: db.Plan,
              attributes: ['codigo'],
              as: 'Plan',
            },
          ],
        },
        {
          model: db.FechaExamen,
          attributes: ['fechaExamen'],
          as: 'FechaExamen',
        },
        {
          model: db.Calificacion,
          attributes: ['calificacion', 'aprobado'],
          as: 'Calificacion',
        },
        {
          model: db.TurnoExamen,
          attributes: ['nombre', 'id_ciclo'],
          as: 'TurnoExamen',
        },
      ],
    });

    const examenesData = examenes.map((examen) => ({
      cicloLectivo: cicloLectivo.anio,
      materia: examen.Previa.Materia.nombre,
      curso: examen.Previa.Curso.nombre,
      condicion: examen.Previa.Condicion.nombre,
      calificacion: examen.Calificacion.calificacion || 'Aus.',
      libro: examen.libro || '-',
      folio: examen.folio || '-',
      fechaExamen: examen.FechaExamen.fechaExamen,
    }));

    // Ordenar los exámenes por fechaExamen, de la más antigua a la más reciente
    examenesData.sort((a, b) => new Date(a.fechaExamen) - new Date(b.fechaExamen));

    return examenesData;
  } catch (error) {
    console.error('Error al obtener los datos del RAC:', error);
    throw error;
  }
};

module.exports = { getRacData, getAlumnoData, getCicloLectivoData, getPreviaData };
