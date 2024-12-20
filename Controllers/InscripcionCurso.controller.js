const db = require('../Models');
const { Sequelize, where } = require('sequelize');
const { Op } = require('sequelize');

exports.lista = (req, res, next) => {
  db.InscripcionCurso.findAll()
    .then((inscripciones_cursos) => {
      res.json(inscripciones_cursos);
    })
    .catch((err) => {
      next(err);
    });
};

exports.filtrar = (req, res, next) => {
  const campo = req.params.campo;
  const valor = req.params.valor;
  db.InscripcionCurso.findAll({
    where: {
      [campo]: valor,
    },
    order: [['id_curso', 'DESC']],
  })
    .then((inscripciones_cursos) => {
      res.json(inscripciones_cursos);
    })
    .catch((err) => {
      next(err);
    });
};

exports.nuevo = (req, res, next) => {
  console.log('NUEVO REGISTRO', req.body);
  if (
    !req.body.id_ciclo ||
    !req.body.id_plan ||
    !req.body.id_curso ||
    !req.body.id_division ||
    !req.body.id_alumno
  ) {
    res.status(400).send({
      message: 'Faltan datos',
    });
    return;
  }
  const inscripcion_curso = {
    id_ciclo: req.body.id_ciclo,
    id_plan: req.body.id_plan,
    id_curso: req.body.id_curso,
    id_division: req.body.id_division,
    id_alumno: req.body.id_alumno,
  };
  db.InscripcionCurso.create(inscripcion_curso)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
};
/*
exports.actualizar = (req, res, next) => {
  const id = req.params.id;
  console.log(req.body.id_ciclo);

  db.InscripcionCurso.update(req.body, {
    where: { id_inscripcion_curso: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'InscripcionCurso actualizada.',
        });
      } else {
        res.send({
          message: 'No se pudo actualizar la InscripcionCurso.',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
*/

exports.actualizar = async (req, res, next) => {
  console.log('ACTUALIZANDO REGISTRO', req.body);
  const id = req.params.id;
  const { id_alumno, id_ciclo } = req.body;

  try {
    // Buscar si existe un registro con el mismo id_alumno y id_ciclo
    const existingRecord = await db.InscripcionCurso.findOne({
      where: { id_alumno, id_ciclo },
    });

    if (existingRecord) {
      // Si existe, actualizar el registro
      const [num] = await db.InscripcionCurso.update(req.body, {
        where: { id_inscripcion_curso: existingRecord.id_inscripcion_curso },
      });

      if (num == 1) {
        res.send({ message: 'InscripcionCurso actualizada.' });
      } else {
        res.send({ message: 'No se pudo actualizar la InscripcionCurso.' });
      }
    } else {
      // Si no existe, crear un nuevo registro
      db.InscripcionCurso.create(req.body)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          next(err);
        }); /*
      const newRecord = await db.InscripcionCurso.create(req.body);
      res.send({ message: 'InscripcionCurso creada.', data: newRecord });
      */
    }
  } catch (err) {
    next(err);
  }
};

exports.eliminar = (req, res, next) => {
  const id = req.params.id;
  db.InscripcionCurso.destroy({
    where: { id_inscripcion_curso: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'InscripcionCurso eliminada.',
        });
      } else {
        res.send({
          message: 'No se pudo eliminar la InscripcionCurso.',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.cursoPorCiclo = async (req, res, next) => {
  const id_ciclo = req.params.id_ciclo;
  console.log('CURSOS POR CICLO', id_ciclo);
  try {
    const inscripciones_cursos = await db.InscripcionCurso.findAll({
      attributes: [
        'id_curso',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('InscripcionCurso.id_curso')), 'cantidad'],
      ],
      where: {
        id_ciclo,
      },
      include: [
        {
          model: db.Curso,
          as: 'Curso',
        },
      ],
      group: ['InscripcionCurso.id_curso'],
      order: [[db.Sequelize.col('InscripcionCurso.id_curso'), 'ASC']],
    });
    console.table(inscripciones_cursos);
    console.log('CANTIDAD DE CURSOS POR CICLO', inscripciones_cursos.length);
    res.json(inscripciones_cursos);
  } catch (err) {
    console.error('Error al obtener las inscripciones de cursos por ciclo', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al obtener las inscripciones de cursos por ciclo' });
    }
    next(err);
  }
};
