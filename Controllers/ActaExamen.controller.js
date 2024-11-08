const db = require('../Models');
const { Sequelize, where } = require('sequelize');
const { Op } = require('sequelize');

// Función para obtener la lista de todas las inscripciones
exports.lista = (req, res, next) => {
  db.Inscripcion.findAll()
    .then((inscripciones) => {
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err);
    });
};

// Función para filtrar las inscripciones por un campo específico
exports.filtrar = (req, res, next) => {
  const campo = req.params.campo;
  const valor = req.params.valor;

  db.Inscripcion.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((inscripciones) => {
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCicloByTurno = async (req, res, next) => {
  try {
    const ciclos = await db.TurnoExamen.findAll({
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('id_ciclo')), 'id_ciclo']],
      order: [['id_ciclo', 'DESC']], // Ordenar de mayor a menor
    });

    const cicloIds = ciclos.map((ciclo) => ciclo.id_ciclo);

    const ciclosConAnio = await db.CicloLectivo.findAll({
      where: {
        id_ciclo: cicloIds,
      },
      attributes: ['id_ciclo', 'anio'],
      order: [['id_ciclo', 'DESC']], // Ordenar de mayor a menor
    });

    res.json(ciclosConAnio);
    //console.log(ciclosConAnio);
  } catch (err) {
    console.error('Error al obtener los ciclos:', err);
    next(err);
  }
};

// Función para obtener los turnos basados en el ciclo lectivo
exports.getTurnosByCiclo = (req, res, next) => {
  const { id_ciclo } = req.params;
  try {
    db.TurnoExamen.findAll({
      where: { id_ciclo },
      attributes: ['id_turno', 'nombre'],
      order: [['id_turno', 'ASC']],
    })
      .then((turnos) => {
        res.json(turnos); // Devolvemos los turnos directamente
      })
      .catch((err) => {
        console.error('Error al obtener los turnos:', err);
        next(err);
      });
  } catch (err) {
    console.error('Error al obtener los turnos:', err);
    next(err);
  }
};

// Función para obtener las condiciones basadas en el ciclo lectivo y turno
// Función asíncrona para obtener las condiciones basadas en el ciclo lectivo y turno
exports.getCondicionesByCicloAndTurno = async (req, res, next) => {
  // Extrae los parámetros id_turno e id_ciclo de la solicitud
  const { id_turno, id_ciclo } = req.params;
  /*
  console.log('ID_TURNO: ', id_turno);
  console.log('ID_CICLO: ', id_ciclo);
  */
  try {
    // Busca todas las inscripciones que coincidan con el id_turno
    const inscripciones = await db.Inscripcion.findAll({
      where: { id_turno },
      // Selecciona solo los valores distintos de id_previa
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('id_previa')), 'id_previa']],
      // Ordena los resultados por id_previa en orden descendente
      order: [['id_previa', 'DESC']],
    });

    // Mapea las inscripciones para obtener una lista de id_previa
    const previaIds = inscripciones.map((inscripcion) => inscripcion.id_previa);

    // Busca todas las previas que coincidan con los id_previa obtenidos
    const previas = await db.Previa.findAll({
      where: {
        id_previa: previaIds,
      },
      // Incluye el modelo Condicion y selecciona los atributos id_condicion y nombre
      include: [{ model: db.Condicion, attributes: ['id_condicion', 'nombre'], as: 'Condicion' }],
      // Selecciona solo el atributo id_previa
      attributes: ['id_previa'],
      // Ordena los resultados por id_condicion en orden descendente
      order: [['id_condicion', 'DESC']],
    });

    // Mapea las previas para obtener una lista de id_condicion
    const condicionIds = previas.map((previa) => previa.Condicion.id_condicion);

    // Busca todas las condiciones que coincidan con los id_condicion obtenidos
    const condiciones = await db.Condicion.findAll({
      where: {
        id_condicion: condicionIds,
      },
      // Selecciona los atributos id_condicion y nombre
      attributes: ['id_condicion', 'nombre'],
    });

    // Envía las condiciones como respuesta en formato JSON
    res.json(condiciones);
    //console.log('Condiciones: ');
    //console.table(condiciones);
  } catch (err) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error al obtener las condiciones:', err);
    next(err);
  }
};

// Función para obtener los cursos basados en el ciclo lectivo, turno y condición
exports.getCursosByCicloTurnoAndCondicion = async (req, res, next) => {
  const { id_ciclo, id_turno, id_condicion } = req.params;
  /*
  console.log('ID_CICLO: ', id_ciclo);
  console.log('ID_TURNO: ', id_turno);
  console.log('ID_CONDICION: ', id_condicion);
  */
  try {
    // Busca todas las inscripciones que coincidan con el id_turno
    const inscripciones = await db.Inscripcion.findAll({
      where: { id_turno },
      // Selecciona solo los valores distintos de id_previa
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('id_previa')), 'id_previa']],
      // Ordena los resultados por id_previa en orden descendente
      order: [['id_previa', 'DESC']],
    });

    // Mapea las inscripciones para obtener una lista de id_previa
    const previaIds = inscripciones.map((inscripcion) => inscripcion.id_previa);

    // Busca todas las previas que coincidan con los id_previa obtenidos
    const previas = await db.Previa.findAll({
      where: {
        id_previa: previaIds,
        id_condicion: id_condicion,
      },
      // Incluye el modelo Condicion y selecciona los atributos id_condicion y nombre
      include: [
        /*{ model: db.Condicion, attributes: ['id_condicion', 'nombre'], as: 'Condicion' },*/
        {
          model: db.Curso,
          attributes: ['id_curso', 'nombre'],
          as: 'Curso',
        },
        {
          model: db.Plan,
          attributes: ['id_plan', 'codigo'],
          as: 'Plan',
        },
      ],
      // Selecciona solo el atributo id_previa
      attributes: ['id_previa', 'id_curso', 'id_plan'],
      // Ordena los resultados por id_condicion en orden descendente
      order: [['id_curso', 'ASC']],
    });

    // Mapea las previas para obtener una lista de objetos con id_curso y codigo del Plan
    const cursosConCodigo = previas.map((previa) => ({
      id_curso: previa.Curso.id_curso,
      codigo: previa.Plan.codigo,
    }));

    // Busca todas las condiciones que coincidan con los id_curso obtenidos
    const cursos = await db.Curso.findAll({
      where: {
        id_curso: cursosConCodigo.map((curso) => curso.id_curso),
      },
      // Selecciona los atributos id_curso, nombre y id_plan
      attributes: ['id_curso', 'nombre', 'id_plan'],
    });

    // Añade el codigo del Plan a los cursos
    const cursosFinales = cursos.map((curso) => {
      const cursoConCodigo = cursosConCodigo.find((c) => c.id_curso === curso.id_curso);
      return {
        ...curso.toJSON(),
        codigo: cursoConCodigo ? cursoConCodigo.codigo : null,
      };
    });

    // Envía los cursos como respuesta en formato JSON
    res.json(cursosFinales);
  } catch (err) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error al obtener los cursos:', err);
    next(err);
  }
};

// Función para obtener las materias basadas en el ciclo lectivo, turno, condición y curso
exports.getMateriasByCicloTurnoCondicionAndCurso = async (req, res, next) => {
  const { id_ciclo, id_turno, id_condicion, id_curso } = req.params;
  console.log('ID_CICLO: ', id_ciclo);
  console.log('ID_TURNO: ', id_turno);
  console.log('ID_CONDICION: ', id_condicion);
  console.log('ID_CURSO: ', id_curso);
  try {
    // Busca todas las inscripciones que coincidan con el id_turno
    const inscripciones = await db.Inscripcion.findAll({
      where: { id_turno },
      // Selecciona solo los valores distintos de id_previa
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('id_previa')), 'id_previa']],
      // Ordena los resultados por id_previa en orden descendente
      order: [['id_previa', 'DESC']],
    });

    // Mapea las inscripciones para obtener una lista de id_previa
    const previaIds = inscripciones.map((inscripcion) => inscripcion.id_previa);

    // Busca todas las previas que coincidan con los id_previa obtenidos
    const previas = await db.Previa.findAll({
      where: {
        id_previa: previaIds,
        id_condicion: id_condicion,
        id_curso: id_curso,
      },
      // Incluye el modelo Condicion y selecciona los atributos id_condicion y nombre
      include: [
        {
          model: db.Materia,
          attributes: ['id_materia', 'nombre'],
          as: 'Materia',
        },
      ],
      // Selecciona solo el atributo id_previa
      attributes: ['id_materia'],
      // Ordena los resultados por id_condicion en orden descendente
      order: [['id_materia', 'ASC']],
    });

    const materiasIds = previas.map((previa) => ({
      id_materia: previa.Materia.id_materia,
    }));

    // Mapea cursosIds para obtener un array de valores id_curso
    const materiaIdsArray = materiasIds.map((materia) => materia.id_materia);

    const materias = await db.Materia.findAll({
      where: {
        id_materia: materiaIdsArray,
      },
      attributes: [
        [db.Sequelize.fn('DISTINCT', db.Sequelize.col('id_materia')), 'id_materia'],
        'id_materia',
        'nombre',
        'id_curso',
      ],
      order: [['id_curso', 'ASC']],
    });

    console.log('Materias: ');
    console.table(materias);

    // Envía las materias como respuesta en formato JSON
    res.json(materias);
  } catch (err) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error al obtener las materias:', err);
    next(err);
  }
};
