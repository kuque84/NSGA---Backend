// Importamos los modelos de la base de datos
const db = require("../Models");
const Op = db.Sequelize.Op;

// Definimos un controlador para obtener la lista de todos los cursos
exports.lista = (req, res, next) => {
  // Utilizamos el método findAll de Sequelize para obtener todos los cursos
  db.Curso.findAll()
    .then((cursos) => {
      // Si la operación es exitosa, enviamos los cursos como respuesta en formato JSON
      res.json(cursos);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para filtrar los cursos por un campo y valor específicos
exports.filtrar = (req, res, next) => {
  // Obtenemos el campo y el valor de los parámetros de la ruta
  const campo = req.params.campo;
  const valor = req.params.valor;
  // Utilizamos el método findAll de Sequelize para obtener los cursos que cumplen con el filtro
  db.Curso.findAll({
    where: {
      [campo]: valor,
    },
  })
    .then((cursos) => {
      // Si la operación es exitosa, enviamos los cursos como respuesta en formato JSON
      res.json(cursos);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para crear un nuevo curso
exports.nuevo = (req, res, next) => {
  // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
  if (!req.body.nombre) {
    // Si no están presentes, enviamos un mensaje de error con el estado 400
    res.status(400).send({
      message: "Faltan datos",
    });
    return;
  }
  // Creamos un objeto con los datos del nuevo curso
  const curso = {
    nombre: req.body.nombre,
    id_plan: req.body.id_plan,
  };
  // Utilizamos el método create de Sequelize para crear el nuevo curso
  db.Curso.create(curso)
    .then((data) => {
      // Si la operación es exitosa, enviamos los datos del nuevo curso como respuesta en formato JSON
      res.json(data);
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para actualizar un curso
exports.actualizar = (req, res, next) => {
  // Obtenemos el ID del curso de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método update de Sequelize para actualizar el curso
  db.Curso.update(req.body, {
    where: { id_curso: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se actualizó un curso, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "curso actualizado",
        });
      } else {
        // Si no se actualizó ningún curso, enviamos un mensaje de error
        res.send({
          message: `No se pudo actualizar el curso con ID=${id}.`,
        });
      }
    })
    .catch((err) => {
      next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para eliminar un curso
exports.eliminar = (req, res, next) => {
  // Obtenemos el ID del curso de los parámetros de la ruta
  const id = req.params.id;
  // Utilizamos el método destroy de Sequelize para eliminar el curso
  db.Curso.destroy({
    where: { id: id },
  })
    .then((num) => {
      // Si la operación es exitosa y se eliminó un curso, enviamos un mensaje de éxito
      if (num == 1) {
        res.send({
          message: "El curso fue eliminado exitosamente.",
        });
      } else {
        // Si no se eliminó ningún curso, enviamos un mensaje de error
        res.send({
          message: `No se pudo eliminar el curso con ID=${id}.`,
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
    db.Curso.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id_curso", "DESC"]],
    })
      .then((registros) => {
        res.status(200).send(registros);
        console.log(registros);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    db.Curso.findAndCountAll({
      where: {
        [Op.or]: [{ nombre: { [Op.like]: `%${text}%` } }],
      },
      limit: limit,
      offset: offset,
      order: [["id_curso", "DESC"]],
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
