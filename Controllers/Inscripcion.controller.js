const db = require('../Models');
const { Sequelize } = require('sequelize');

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

// Función para crear una nueva inscripción
exports.nuevo = (req, res, next) => {
  const { id_previa, id_turno, id_fechaExamen, id_calificacion, libro, folio } = req.body;

  if (!id_previa || !id_turno || !id_fechaExamen) {
    return res.status(400).send({
      message: 'Faltan datos para realizar la inscripción',
    });
  }

  const inscripcion = {
    id_previa,
    id_turno,
    id_fechaExamen,
    id_calificacion,
    libro,
    folio,
  };

  db.Inscripcion.create(inscripcion)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      if (err instanceof Sequelize.UniqueConstraintError) {
        res.status(409).json({
          message: 'El alumno ya se encuentra inscripto en esta materia.',
        });
      } else {
        next(err);
      }
    });
};

// Función para actualizar una inscripción existente
exports.actualizar = (req, res, next) => {
  const id = req.params.id;

  db.Inscripcion.update(req.body, {
    where: { id_inscripcion: id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({
          message: 'Inscripcion actualizada exitosamente',
        });
      } else {
        throw new Error('No se pudo actualizar la inscripcion');
      }
    })
    .catch((err) => {
      next({
        message: err.message,
      });
    });
};

// Función para eliminar una inscripción existente
exports.eliminar = (req, res, next) => {
  const id = req.params.id;
  console.log(`Eliminar inscripcion con id: ${id}`);

  db.Inscripcion.destroy({
    where: { id_inscripcion: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'inscripcion eliminada',
        });
      } else {
        res.send({
          message: 'No se pudo eliminar la inscripcion',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Función para filtrar las inscripciones por un campo específico
exports.filtrarActa = (req, res, next) => {
  const { id_materia, id_condicion, id_turno } = req.params;
  const { generatePDF } = req.query; // Obtener el parámetro opcional de la consulta

  db.Inscripcion.findAll({
    where: {
      id_turno,
    },
    include: [
      {
        model: db.Previa,
        as: 'Previa',
        attributes: ['id_previa', 'id_alumno', 'id_materia', 'id_condicion'],
        where: {
          id_condicion,
          id_materia,
        },
        include: [
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
            model: db.CicloLectivo,
            attributes: ['anio'],
            as: 'CicloLectivo',
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
            model: db.Alumno,
            attributes: ['dni', 'apellidos', 'nombres'],
            as: 'Alumno',
          },
          {
            model: db.Calificacion,
            attributes: ['calificacion', 'aprobado'],
            as: 'Calificacion',
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
  })
    .then((inscripciones) => {
      if (generatePDF) {
        //pasar inscripciones a json
        inscripciones = inscripciones.map((inscripcion) => inscripcion.toJSON());
        req.data = inscripciones; // Almacenar los datos en req.data
        next(); // Pasar al siguiente middleware para generar el PDF
      } else {
        res.json(inscripciones); // Enviar la respuesta JSON
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Función para actualizar las actas de examen
exports.actualizarActa = async (req, res, next) => {
  const acta = req.body;
  console.log('Acta recibida:', acta);

  if (!acta) {
    return res.status(400).send({ message: 'Faltan datos del acta' });
  }

  const { fecha, inscripcion, libro, folio, previa } = acta;
  const { id_fechaExamen, fechaExamen } = fecha;

  if (!fechaExamen || !inscripcion || !libro || !folio || !id_fechaExamen || !previa) {
    console.error('Datos incompletos del acta:', {
      fecha,
      inscripcion,
      libro,
      folio,
      id_fechaExamen,
      previa,
    });
    return res.status(400).send({ message: 'Faltan datos del acta' });
  }

  const t = await db.sequelize.transaction();

  try {
    // Actualizar FechaExamen
    console.log(
      `Actualizando FechaExamen: id_fechaExamen=${id_fechaExamen}, fechaExamen=${fechaExamen}`
    );
    await db.FechaExamen.update(
      { fechaExamen: fechaExamen },
      { where: { id_fechaExamen }, transaction: t }
    );

    // Actualizar cada Inscripcion
    const inscripcionPromises = inscripcion.map((insc) => {
      const { id_inscripcion, ...restoInscripcion } = insc;

      if (isNaN(id_inscripcion)) {
        throw new Error('El id de inscripción debe ser un número entero');
      }

      console.log(
        `Actualizando Inscripcion: id_inscripcion=${id_inscripcion}, datos=${JSON.stringify(
          restoInscripcion
        )}`
      );
      return db.Inscripcion.update(
        { ...restoInscripcion, libro, folio, id_fechaExamen },
        { where: { id_inscripcion }, transaction: t }
      );
    });

    // Filtrar y actualizar cada Previa solo si está aprobada
    const previaPromises = previa.map(async (prev) => {
      const { id_previa, id_calificacion } = prev;

      console.log(`Buscando Calificacion: id_calificacion=${id_calificacion}`);
      const calificacion = await db.Calificacion.findOne({
        where: { id_calificacion },
        attributes: ['aprobado'],
        transaction: t,
      });

      if (calificacion && calificacion.aprobado) {
        console.log(
          `Actualizando Previa aprobada: id_previa=${id_previa}, id_calificacion=${id_calificacion}`
        );
        return db.Previa.update({ id_calificacion }, { where: { id_previa }, transaction: t });
      }

      console.log(`Previa no aprobada: id_previa=${id_previa}`);
      return Promise.resolve();
    });

    await Promise.all([...inscripcionPromises, ...previaPromises]);

    await t.commit();

    res.json({ message: 'Acta actualizada exitosamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar el acta:', error.message, error.stack);
    res.status(500).send({ message: 'Error al actualizar el acta', error: error.message });
  }
};

exports.filtrarPorAlumno = (req, res, next) => {
  console.log('Filtrar inscripciones por alumno');
  const { id_alumno } = req.params;

  db.Inscripcion.findAll({
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
  })
    .then((inscripciones) => {
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err);
    });
};
