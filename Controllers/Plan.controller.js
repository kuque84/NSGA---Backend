// Importamos el modelo de la base de datos
const db = require("../Models");
const Op = db.Sequelize.Op;

// Función para obtener la lista de todos los planes
exports.lista = (req, res, next) => {
  // Usamos el método findAll de Sequelize para obtener todos los planes
  db.Plan.findAll()
    .then((Planes) => {
      // Si la operación es exitosa, devolvemos los planes como respuesta JSON
      res.json(Planes);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para filtrar planes por un campo específico
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la solicitud
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Buscamos todos los planes que coinciden con el valor en el campo especificado
  db.Plan.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((Planes) => {
      // Si la operación es exitosa, devolvemos los planes como respuesta JSON
      res.json(Planes);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para crear un nuevo plan
exports.nuevo = (req, res, next) => {
  console.log("Peticion por nuevo Plan ", req.body);
  // Verificamos que los datos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.codigo || !req.body.descripcion) {
    // Si faltan datos, enviamos un mensaje de error con un código de estado 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos del nuevo plan
  const Plan = {
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
  };
  // Usamos el método create de Sequelize para crear el nuevo plan
  db.Plan.create(Plan)
    .then((data) => {
      // Si la operación es exitosa, devolvemos los datos del nuevo plan como respuesta JSON
      res.json(data);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para actualizar un plan existente
exports.actualizar = (req, res, next) => {
  // Obtenemos el ID del plan de los parámetros de la solicitud
  const id = req.params.id;
  // Usamos el método update de Sequelize para actualizar el plan
  db.Plan.update(req.body, {
    where: { id_plan: id },
  })
    .then((num) => {
      // Si la operación es exitosa, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "Plan actualizado",
        });
      } else {
        // Si no se pudo actualizar el plan, enviamos un mensaje de error
        res.send({
          message: "No se pudo actualizar el Plan",
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Función para eliminar un plan existente
exports.eliminar = (req, res, next) => {
  // Obtenemos el ID del plan de los parámetros de la solicitud
  const id = req.params.id;
  // Imprimimos un mensaje en la consola indicando que vamos a eliminar el plan
  console.log(`Eliminar Plan con id: ${id}`);
  // Usamos el método destroy de Sequelize para eliminar el plan
  db.Plan.destroy({
    where: { id_plan: id },
  })
    .then((num) => {
      // Si la operación es exitosa, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "Plan eliminado",
        });
      } else {
        // Si no se pudo eliminar el plan, enviamos un mensaje de error
        res.send({
          message: "No se pudo eliminar el Plan",
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
    db.Plan.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id_plan", "DESC"]],
    })
      .then((registros) => {
        res.status(200).send(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    db.Plan.findAndCountAll({
      where: {
        [Op.or]: [
          { descripcion: { [Op.like]: `%${text}%` } },
          { codigo: { [Op.like]: `%${text}%` } },
        ],
      },
      limit: limit,
      offset: offset,
      order: [["id_plan", "DESC"]],
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
