// Importamos los modelos de la base de datos
const db = require("../Models");

// Definimos un controlador para obtener la lista de todas las fechas de examen
exports.lista = (req, res, next) => {
  // Utilizamos el método findAll de Sequelize para obtener todas las fechas de examen
  db.FechaExamen.findAll()
    .then((fechasExamen) => {
      // Si la operación es exitosa, enviamos las fechas de examen como respuesta en formato JSON
      res.json(fechasExamen);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para filtrar las fechas de examen por un campo y valor específicos
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Utilizamos el método findAll de Sequelize para obtener las fechas de examen que cumplen con el filtro
  db.FechaExamen.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((fechasExamen) => {
      // Si la operación es exitosa, enviamos las fechas de examen como respuesta en formato JSON
      res.json(fechasExamen);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

exports.filtrarPorInscripcion = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta
  console.log("Filtrar por inscripcion");
  const id_turno = req.params.id_turno;
  const id_materia = req.params.id_materia;
  // Utilizamos el método findAll de Sequelize para obtener las fechas de examen que cumplen con el filtro
  db.FechaExamen.findOrCreate({
    where: {
      id_turno: id_turno,
      id_materia: id_materia,
    },
    defaults: {
      fechaExamen: new Date()
    }
  })
  .then(([fechaExamen, created]) => {
    if (created) {
      res.json(fechaExamen);
      console.log('Se creó una nueva fecha de examen.');
    } else {
      res.json(fechaExamen);
      console.log('Se encontró una fecha de examen existente.');
    }
  })
  .catch(error => {
    console.error(error);
  });
};

// Definimos un controlador para crear una nueva fecha de examen
exports.nuevo = (req, res, next) => {
  // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.fechaExamen || !req.body.id_turno || !req.body.id_materia) {
    // Si no están presentes, enviamos un mensaje de error con el estado 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos de la nueva fecha de examen
  const fechaExamen = {
    fechaExamen: req.body.fechaExamen,
    id_turno: req.body.id_turno,
    id_materia: req.body.id_materia,
  };
  // Utilizamos el método create de Sequelize para crear la nueva fecha de examen
  db.FechaExamen.create(fechaExamen)
    .then((data) => {
      // Si la operación es exitosa, enviamos los datos de la nueva fecha de examen como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para actualizar una fecha de examen existente
exports.actualizar = (req, res, next) => {
  // Obtenemos el id de la fecha de examen de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método update de Sequelize para actualizar la fecha de examen
  db.FechaExamen.update(req.body, {
    where: { id_fechaExamen: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se actualizó una fecha de examen, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "fechaExamen actualizado",
        });
      } else {
        // Si no se actualizó ninguna fecha de examen, enviamos un mensaje de error
        res.send({
          message: "No se pudo actualizar la fecha de examen",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para eliminar una fecha de examen existente
exports.eliminar = (req, res, next) => {
  // Obtenemos el id de la fecha de examen de los parámetros de la ruta
  const id = req.params.id;
  // Imprimimos un mensaje en la consola indicando que se va a eliminar una fecha de examen
  console.log(`Eliminar fechaExamen con id: ${id}`);
  // Utilizamos el método destroy de Sequelize para eliminar la fecha de examen
  db.FechaExamen.destroy({
    where: { id_fechaExamen: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se eliminó una fecha de examen, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "fechaExamen eliminado",
        });
      } else {
        // Si no se eliminó ninguna fecha de examen, enviamos un mensaje de error
        res.send({
          message: "No se pudo eliminar la fecha de examen",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};
