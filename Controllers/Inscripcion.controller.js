// Importamos el modelo de la base de datos
const db = require("../Models");
const { Sequelize } = require("sequelize");

// Función para obtener la lista de todas las inscripciones
exports.lista = (req, res, next) => {
  // Buscamos todas las inscripciones en la base de datos
  db.Inscripcion.findAll()
    .then((inscripciones) => {
      // Si la búsqueda es exitosa, devolvemos las inscripciones como respuesta en formato JSON
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para filtrar las inscripciones por un campo específico
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor por el cual filtrar de los parámetros de la solicitud
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Buscamos todas las inscripciones que coincidan con el filtro
  db.Inscripcion.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((inscripciones) => {
      // Si la búsqueda es exitosa, devolvemos las inscripciones filtradas como respuesta en formato JSON
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para crear una nueva inscripción
exports.nuevo = (req, res, next) => {
  // Verificamos que todos los campos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.id_previa || !req.body.id_turno || !req.body.id_fechaExamen) {
    // Si falta algún campo, devolvemos un mensaje de error con un código de estado 400
    res.status(400).send({
      message: "Faltan datos para realizar la inscripción",
    });
    return;
  }
  // Creamos un objeto con los datos de la nueva inscripción
  const inscripcion = {
    id_previa: req.body.id_previa,
    id_turno: req.body.id_turno,
    id_fechaExamen: req.body.id_fechaExamen,
    id_calificacion: req.body.id_calificacion,
    libro: req.body.libro,
    folio: req.body.folio,
  };
  // Creamos la nueva inscripción en la base de datos
  db.Inscripcion.create(inscripcion)
    .then((data) => {
      // Si la operación es exitosa, enviamos la nueva instancia como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      if (err instanceof Sequelize.UniqueConstraintError) {
        res.status(409).json({
          message: "El alumno ya se encuentra inscripto en esta materia.",
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
          message: "Inscripcion actualizada exitosamente",
        });
      } else {
        throw new Error("No se pudo actualizar la inscripcion");
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
  // Obtenemos el id de la inscripción a eliminar de los parámetros de la solicitud
  const id = req.params.id;
  // Imprimimos un mensaje en la consola indicando el id de la inscripción a eliminar
  console.log(`Eliminar inscripcion con id: ${id}`);
  // Eliminamos la inscripción de la base de datos
  db.Inscripcion.destroy({
    where: { id_inscripcion: id },
  })
    .then((num) => {
      // Si la eliminación es exitosa, devolvemos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "inscripcion eliminado",
        });
      } else {
        // Si no se pudo eliminar la inscripción, devolvemos un mensaje de error
        res.send({
          message: "No se pudo eliminar la inscripcion",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para filtrar las inscripciones por un campo específico
exports.filtrarActa = (req, res, next) => {
  const id_materia = req.params.id_materia;
  const id_condicion = req.params.id_condicion;
  const id_turno = req.params.id_turno;

  // Buscamos todas las inscripciones que coincidan con el filtro
  db.Inscripcion.findAll({
    where: {
      id_turno: id_turno,
    },
      include:[
        {
          model: db.Previa,
          as: "Previa",
          atributes: ["id_previa", "id_alumno", "id_materia", "id_condicion"],
          where: {
            id_condicion: id_condicion,
            id_materia: id_materia,
          },
          include:[
            {
              model: db.Curso,
              attributes: ["nombre"],
              as: "Curso"
            },
            {
              model: db.Materia,
              attributes: ["nombre"],
              as: "Materia"
            },
            {
              model: db.CicloLectivo,
              attributes: ["anio"],
              as: "CicloLectivo"
            },
            {
              model: db.Condicion,
              attributes: ["nombre"],
              as: "Condicion"
            },
            {
              model: db.Plan,
              attributes: ["codigo"],
              as: "Plan"
            },
            {
              model: db.Alumno,
              attributes: ["dni","apellidos", "nombres"],
              as: "Alumno"
            },
            {
              model: db.Calificacion,
              attributes: ["calificacion", "aprobado"],
              as: "Calificacion"
            }
          ]
        },
        {
          model:db.FechaExamen,
          attributes: ["fechaExamen"],
          as: "FechaExamen",
        },
        {
          model:db.Calificacion,
          attributes: ["calificacion", "aprobado"],
          as: "Calificacion"
        }
      ]
    },
  )
    .then((inscripciones) => {
      // Si la búsqueda es exitosa, devolvemos las inscripciones filtradas como respuesta en formato JSON
      res.json(inscripciones);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};
