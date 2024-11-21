const db = require('../Models');

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
