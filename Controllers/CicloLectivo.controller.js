// Importamos los modelos de la base de datos
const db = require("../Models");
const Op = db.Sequelize.Op;

// Definimos un controlador para obtener la lista de todos los ciclos lectivos
exports.lista = (req, res, next) => {
  // Utilizamos el método findAll de Sequelize para obtener todos los ciclos lectivos
  db.CicloLectivo.findAll()
    .then((ciclolectivos) => {
      // Si la operación es exitosa, enviamos los ciclos lectivos como respuesta en formato JSON
      res.json(ciclolectivos);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para filtrar los ciclos lectivos por un campo y valor específicos
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta
  const campo = req.params.campo;
  const valor = req.params.valor;
  console.log(`Filtrar por ${campo} = ${valor}`);
  // Utilizamos el método findAll de Sequelize para obtener los ciclos lectivos que cumplen con el filtro
  db.CicloLectivo.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((ciclolectivos) => {
      // Si la operación es exitosa, enviamos los ciclos lectivos como respuesta en formato JSON
      res.json(ciclolectivos);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para crear un nuevo ciclo lectivo
exports.nuevo = (req, res, next) => {
  // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.anio) {
    // Si no están presentes, enviamos un mensaje de error con el estado 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos del nuevo ciclo lectivo
  const ciclolectivo = {
    anio: req.body.anio,
  };
  // Utilizamos el método create de Sequelize para crear el nuevo ciclo lectivo
  db.CicloLectivo.create(ciclolectivo)
    .then((data) => {
      // Si la operación es exitosa, enviamos los datos del nuevo ciclo lectivo como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      // Si el error es una violación de restricción única, enviamos un código de estado 409
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(409).send({
          message: "Ya existe un alumno con el DNI proporcionado.",
        });
      } else {
        next(err); // Pasamos el error al middleware de manejo de errores
      }
    });
};

// Definimos un controlador para actualizar un ciclo lectivo
exports.actualizar = (req, res, next) => {
  // Obtenemos el id del ciclo lectivo de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método update de Sequelize para actualizar el ciclo lectivo
  db.CicloLectivo.update(req.body, {
    where: { id_ciclo: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se actualizó un ciclo lectivo, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "ciclo lectivo actualizado",
        });
      } else {
        // Si no se actualizó ningún ciclo lectivo, enviamos un mensaje de error
        res.send({
          message: "No se pudo actualizar el ciclo lectivo",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para eliminar un ciclo lectivo
exports.eliminar = (req, res, next) => {
  // Obtenemos el id del ciclo lectivo de los parámetros de la ruta
  const id = req.params.id;
  // Imprimimos un mensaje en la consola indicando que se va a eliminar el ciclo lectivo con el id especificado
  console.log(`Eliminar ciclo lectivo con id: ${id}`);
  // Utilizamos el método destroy de Sequelize para eliminar el ciclo lectivo
  db.CicloLectivo.destroy({
    where: { id_ciclo: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se eliminó un ciclo lectivo, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "ciclo lectivo eliminado",
        });
      } else {
        // Si no se eliminó ningún ciclo lectivo, enviamos un mensaje de error
        res.send({
          message: "No se pudo eliminar el ciclo lectivo",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

exports.listaPag = (req, res) => {
  console.log("Procesamiento de lista filtrada por pagina");
  const pag = req.params.pag;
  const text = req.params.text;
  if (!pag) {
    pag = 1;
  }
  const limit = 5; //limite de registros por pagina
  const offset = (pag - 1) * limit; //offset es el numero de registros que se saltara - desde donde comenzará
  if (!text) {
    db.CicloLectivo.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["anio", "DESC"]],
    })
      .then((registros) => {
        res.status(200).send(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    db.CicloLectivo.findAndCountAll({
      where: {
        [Op.or]: [{ anio: { [Op.like]: `%${text}%` } }],
      },
      limit: limit,
      offset: offset,
      order: [["anio", "DESC"]],
    })
      .then((registros) => {
        res.status(200).send(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
  console.log(`pagina: ${pag} texto:${text}`);
};
