// Importamos el objeto 'db' que contiene los modelos de la base de datos
const db = require("../Models");
const Op = db.Sequelize.Op;

// Definimos el método 'lista' que se encargará de obtener todas las instancias de 'TurnoExamen'
exports.lista = (req, res, next) => {
  // Utilizamos el método 'findAll' de Sequelize para obtener todas las instancias de 'TurnoExamen'
  db.TurnoExamen.findAll()
    .then((turnosExamen) => {
      // Si la operación es exitosa, enviamos las instancias obtenidas como respuesta en formato JSON
      res.json(turnosExamen);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos el método 'filtrar' que se encargará de obtener las instancias de 'TurnoExamen' que coincidan con un valor específico en un campo específico
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta de la solicitud HTTP
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Utilizamos el método 'findAll' de Sequelize para obtener las instancias de 'TurnoExamen' que tienen ese valor en ese campo
  db.TurnoExamen.findAll({
    where: {
      [campo]: valor,
    },
    include: [
      // {
      //     model: db.Condicion,
      //     attributes: ["nombre"],
      //     as: "Condicion"
      // },
      {
        model: db.CicloLectivo,
        as: "CicloLectivo",
      },
    ],
  })
    .then((turnosExamen) => {
      // Si la operación es exitosa, enviamos las instancias obtenidas como respuesta en formato JSON
      res.json(turnosExamen);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos el método 'nuevo' que se encargará de crear una nueva instancia de 'TurnoExamen'
exports.nuevo = (req, res, next) => {
  // Verificamos que los datos necesarios estén presentes en el cuerpo de la solicitud HTTP
  if (!req.body.nombre || !req.body.id_ciclo) {
    //if(!req.body.nombre || !req.body.id_ciclo || !req.body.id_condicion){
    // Si faltan datos, enviamos un mensaje de error con un código de estado HTTP 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos de la nueva instancia
  const turnoExamen = {
    nombre: req.body.nombre,
    //id_condicion: req.body.id_condicion,
    id_ciclo: req.body.id_ciclo,
  };
  // Utilizamos el método 'create' de Sequelize para crear la nueva instancia en la base de datos
  db.TurnoExamen.create(turnoExamen)
    .then((data) => {
      // Si la operación es exitosa, enviamos la nueva instancia como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      if (err instanceof Sequelize.UniqueConstraintError) {
        res.status(409).json({
          message: "La instancia de exámen ya existe.",
        });
      } else {
        next(err);
      }
    });
};

exports.actualizar = async (req, res, next) => {
  const id = req.params.id;
  try {
    const [actualizado] = await db.TurnoExamen.update(req.body, {
      where: { id_turno: id },
    });

    if (actualizado === 1) {
      res.send({ message: "Turno de examen actualizado correctamente" });
    } else {
      res.status(404).send({ message: "No se encontró el turno de examen" });
    }
  } catch (err) {
    console.error("Error al actualizar el turno de examen:", err);
    next(err);
  }
};

// Definimos el método 'eliminar' que se encargará de eliminar una instancia existente de 'TurnoExamen'
exports.eliminar = (req, res, next) => {
  // Obtenemos el ID de los parámetros de la ruta de la solicitud HTTP
  const id = req.params.id;
  // Imprimimos un mensaje en la consola indicando que se intentará eliminar la instancia con ese ID
  console.log(`Eliminar turnoExamen con id: ${id}`);
  // Utilizamos el método 'destroy' de Sequelize para eliminar la instancia en la base de datos
  db.TurnoExamen.destroy({
    where: { id_turnoExamen: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se eliminó una instancia, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "turnoExamen eliminado",
        });
      } else {
        // Si no se pudo eliminar la instancia, enviamos un mensaje de error
        res.send({
          message: "No se pudo eliminar el turno de examen",
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
    db.TurnoExamen.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: db.CicloLectivo,
          attributes: ["anio"],
          as: "CicloLectivo",
        },
      ],
      order: [
        ["id_ciclo", "DESC"],
        ["id_turno", "DESC"],
      ],
    })
      .then((registros) => {
        res.status(200).send(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    db.TurnoExamen.findAndCountAll({
      where: {
        [Op.or]: [{ nombre: { [Op.like]: `%${text}%` } }],
      },
      limit: limit,
      offset: offset,
      include: [
        {
          model: db.CicloLectivo,
          attributes: ["anio"],
          as: "CicloLectivo",
        },
      ],
      order: [
        ["id_ciclo", "DESC"],
        ["id_turno", "DESC"],
      ],
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
