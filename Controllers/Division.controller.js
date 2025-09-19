// Importamos los modelos de la base de datos
const db = require("../Models");

// Definimos un controlador para obtener la lista de todas las divisiones
exports.lista = (req, res, next) => {
  // Utilizamos el método findAll de Sequelize para obtener todas las divisiones
  db.Division.findAll()
    .then((divisiones) => {
      // Si la operación es exitosa, enviamos las divisiones como respuesta en formato JSON
      res.json(divisiones);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para filtrar las divisiones por un campo y valor específicos
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Utilizamos el método findAll de Sequelize para obtener las divisiones que cumplen con el filtro
  db.Division.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((divisiones) => {
      // Si la operación es exitosa, enviamos las divisiones como respuesta en formato JSON
      res.json(divisiones);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para crear una nueva división
exports.nuevo = (req, res, next) => {
  // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.nombre) {
    // Si no están presentes, enviamos un mensaje de error con el estado 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos de la nueva división
  const division = {
    nombre: req.body.nombre,
    id_curso: req.body.id_curso,
  };
  // Utilizamos el método create de Sequelize para crear la nueva división
  db.Division.create(division)
    .then((data) => {
      // Si la operación es exitosa, enviamos los datos de la nueva división como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para actualizar una división existente
exports.actualizar = (req, res, next) => {
  // Obtenemos el id de la división de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método update de Sequelize para actualizar la división
  db.Division.update(req.body, {
    where: { id_division: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se actualizó una división, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "División actualizada",
        });
      } else {
        // Si no se actualizó ninguna división, enviamos un mensaje de error
        res.send({
          message: "No se pudo actualizar la división",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para eliminar una división existente
exports.eliminar = (req, res, next) => {
  // Obtenemos el id de la división de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método destroy de Sequelize para eliminar la división
  db.Division.destroy({
    where: { id_division: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se eliminó una división, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "División eliminada",
        });
      } else {
        // Si no se eliminó ninguna división, enviamos un mensaje de error
        res.send({
          message: "No se pudo eliminar la división",
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
    db.Division.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["nombre", "ASC"]],
    })
      .then((registros) => {
        res.status(200).send(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    db.Division.findAndCountAll({
      where: {
        [Op.or]: [{ nombre: { [Op.like]: `%${text}%` } }],
      },
      limit: limit,
      offset: offset,
      order: [["nombre", "ASC"]],
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
