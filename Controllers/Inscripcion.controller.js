const db = require("../Models");
const { Sequelize, where } = require("sequelize");
const moment = require("moment"); // Importa la librería moment
const csv = require("csv-parser");
const stream = require("stream"); // Módulo nativo de Node.js
const logger = console; // Usa tu logger real
const { generarPDF } = require("../Services/pdfGenerator"); // Importa el servicio PDF

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
  const { id_previa, id_turno, id_fechaExamen, id_calificacion, libro, folio } =
    req.body;

  if (!id_previa || !id_turno || !id_fechaExamen) {
    return res.status(400).send({
      message: "Faltan datos para realizar la inscripción",
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
  const id = req.params.id;
  //console.log(`Eliminar inscripcion con id: ${id}`);

  db.Inscripcion.destroy({
    where: { id_inscripcion: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "inscripcion eliminada",
        });
      } else {
        res.send({
          message: "No se pudo eliminar la inscripcion",
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
        as: "Previa",
        attributes: ["id_previa", "id_alumno", "id_materia", "id_condicion"],
        where: {
          id_condicion,
          id_materia,
        },
        include: [
          {
            model: db.Curso,
            attributes: ["nombre"],
            as: "Curso",
          },
          {
            model: db.Materia,
            attributes: ["nombre"],
            as: "Materia",
          },
          {
            model: db.CicloLectivo,
            attributes: ["anio"],
            as: "CicloLectivo",
          },
          {
            model: db.Condicion,
            attributes: ["nombre"],
            as: "Condicion",
          },
          {
            model: db.Plan,
            attributes: ["codigo"],
            as: "Plan",
          },
          {
            model: db.Alumno,
            attributes: ["dni", "apellidos", "nombres"],
            as: "Alumno",
          },
          {
            model: db.Calificacion,
            attributes: ["calificacion", "aprobado"],
            as: "Calificacion",
          },
        ],
      },
      {
        model: db.FechaExamen,
        attributes: ["fechaExamen"],
        as: "FechaExamen",
      },
      {
        model: db.Calificacion,
        attributes: ["calificacion", "aprobado"],
        as: "Calificacion",
      },
      {
        model: db.TurnoExamen,
        attributes: ["nombre", "id_ciclo"],
        as: "TurnoExamen",
      },
    ],
  })
    .then((inscripciones) => {
      inscripciones.sort((a, b) => {
        const apellidoA = a.Previa.Alumno.apellidos.toUpperCase();
        const apellidoB = b.Previa.Alumno.apellidos.toUpperCase();
        const nombreA = a.Previa.Alumno.nombres.toUpperCase();
        const nombreB = b.Previa.Alumno.nombres.toUpperCase();

        if (apellidoA < apellidoB) {
          return -1;
        } else if (apellidoA > apellidoB) {
          return 1;
        }
        if (nombreA < nombreB) {
          return -1;
        } else if (nombreA > nombreB) {
          return 1;
        }
        return 0;
      });
      if (generatePDF) {
        //pasar inscripciones a json
        inscripciones = inscripciones.map((inscripcion) =>
          inscripcion.toJSON()
        );
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

exports.filtrarActaColoquio = async (req, res, next) => {
  const {
    id_ciclo,
    id_curso,
    id_division,
    id_materia,
    id_condicion,
    id_turno,
  } = req.params;
  const { generatePDF } = req.query; // Obtener el parámetro opcional de la consulta
  console.log("Filtrar acta de coloquio");

  try {
    const fechaExamen = await db.FechaExamen.findOne({
      where: {
        id_turno,
        id_materia,
        id_condicion,
        id_curso,
        id_division,
      },
    });

    if (fechaExamen) {
      const id_fechaExamen = fechaExamen.id_fechaExamen;
      console.log("Fecha de examen encontrada:", fechaExamen.fechaExamen);

      console.log("Datos recibidos:", {
        id_ciclo,
        id_curso,
        id_division,
        id_materia,
        id_condicion,
        id_turno,
        id_fechaExamen,
      });

      const division = await db.Division.findOne({
        where: { id_division },
        attributes: ["nombre"],
      });

      const inscripciones = await db.Inscripcion.findAll({
        where: {
          id_turno,
          id_fechaExamen,
        },
        include: [
          {
            model: db.Previa,
            as: "Previa",
            attributes: [
              "id_previa",
              "id_alumno",
              "id_materia",
              "id_condicion",
            ],
            where: {
              id_condicion,
              id_materia,
            },
            include: [
              {
                model: db.Curso,
                attributes: ["nombre"],
                as: "Curso",
              },
              {
                model: db.Materia,
                attributes: ["nombre"],
                as: "Materia",
              },
              {
                model: db.CicloLectivo,
                attributes: ["anio"],
                as: "CicloLectivo",
              },
              {
                model: db.Condicion,
                attributes: ["nombre"],
                as: "Condicion",
              },
              {
                model: db.Plan,
                attributes: ["codigo"],
                as: "Plan",
              },
              {
                model: db.Alumno,
                attributes: ["dni", "apellidos", "nombres"],
                as: "Alumno",
              },
              {
                model: db.Calificacion,
                attributes: ["calificacion", "aprobado"],
                as: "Calificacion",
              },
            ],
          },
          {
            model: db.FechaExamen,
            attributes: ["fechaExamen"],
            as: "FechaExamen",
          },
          {
            model: db.Calificacion,
            attributes: ["calificacion", "aprobado"],
            as: "Calificacion",
          },
          {
            model: db.TurnoExamen,
            attributes: ["nombre", "id_ciclo"],
            as: "TurnoExamen",
          },
        ],
      });

      inscripciones.sort((a, b) => {
        const apellidoA = a.Previa.Alumno.apellidos.toUpperCase();
        const apellidoB = b.Previa.Alumno.apellidos.toUpperCase();
        const nombreA = a.Previa.Alumno.nombres.toUpperCase();
        const nombreB = b.Previa.Alumno.nombres.toUpperCase();

        if (apellidoA < apellidoB) {
          return -1;
        } else if (apellidoA > apellidoB) {
          return 1;
        }
        if (nombreA < nombreB) {
          return -1;
        } else if (nombreA > nombreB) {
          return 1;
        }
        return 0;
      });

      // Incluir los datos adicionales a inscripciones
      inscripciones.forEach((inscripcion) => {
        inscripcion.Previa.Curso.dataValues.division = division.nombre;
      });
      console.log("inscripciones.Previa.Curso:", inscripciones[0].Previa.Curso);
      if (generatePDF) {
        // Pasar inscripciones a JSON
        const inscripcionesJSON = inscripciones.map((inscripcion) =>
          inscripcion.toJSON()
        );
        req.data = inscripcionesJSON; // Almacenar los datos en req.data
        console.log("Inscripciones encontradas:", inscripciones);
        next(); // Pasar al siguiente middleware para generar el PDF
      } else {
        res.json(inscripciones); // Enviar la respuesta JSON
      }
    } else {
      console.log(
        "No se encontró una fecha de examen para los criterios proporcionados."
      );
      return res.status(404).send({
        message:
          "No se encontró una fecha de examen para los criterios proporcionados.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Función para actualizar las actas de examen
exports.actualizarActa = async (req, res, next) => {
  const acta = req.body;
  //console.log('Acta recibida:', acta);

  if (!acta) {
    return res.status(400).send({ message: "Faltan datos del acta" });
  }

  const { fecha, inscripcion, libro, folio, previa, id_condicion } = acta;
  const { id_fechaExamen, fechaExamen } = fecha;

  if (
    !fechaExamen ||
    !inscripcion ||
    /*
    !libro ||
    !folio ||*/
    !id_fechaExamen ||
    !previa ||
    !id_condicion
  ) {
    console.error("Datos incompletos del acta:", {
      fecha,
      inscripcion,
      libro,
      folio,
      id_fechaExamen,
      previa,
      id_condicion,
    });
    return res.status(400).send({ message: "Faltan datos del acta" });
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
        throw new Error("El id de inscripción debe ser un número entero");
      }

      if (restoInscripcion.id_calificacion === "") {
        restoInscripcion.id_calificacion = null;
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
        attributes: ["aprobado"],
        transaction: t,
      });

      if (calificacion) {
        if (calificacion.aprobado) {
          console.log(
            `Actualizando Previa aprobada: id_previa=${id_previa}, id_calificacion=${id_calificacion}`
          );
          return db.Previa.update(
            { id_calificacion },
            { where: { id_previa }, transaction: t }
          );
        } else {
          console.log(
            `Previa no aprobada: id_previa=${id_previa}, estableciendo id_calificacion=1`
          );
          return db.Previa.update(
            { id_calificacion: 1 },
            { where: { id_previa }, transaction: t }
          );
        }
      }

      console.log(
        `Calificación no encontrada: id_calificacion=${id_calificacion}`
      );
      return Promise.resolve();
    });

    await Promise.all([...inscripcionPromises, ...previaPromises]);

    await t.commit();

    res.json({ message: "Acta actualizada exitosamente" });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar el acta:", error.message, error.stack);
    res
      .status(500)
      .send({ message: "Error al actualizar el acta", error: error.message });
  }
};

exports.filtrarPorAlumno = (req, res, next) => {
  console.log("Filtrar inscripciones por alumno");
  const { id_alumno } = req.params;

  db.Inscripcion.findAll({
    include: [
      {
        model: db.Previa,
        as: "Previa",
        where: { id_alumno },
        include: [
          {
            model: db.Alumno,
            attributes: ["dni", "apellidos", "nombres"],
            as: "Alumno",
          },
          {
            model: db.Curso,
            attributes: ["nombre"],
            as: "Curso",
          },
          {
            model: db.Materia,
            attributes: ["nombre"],
            as: "Materia",
          },
          {
            model: db.Condicion,
            attributes: ["nombre"],
            as: "Condicion",
          },
          {
            model: db.Plan,
            attributes: ["codigo"],
            as: "Plan",
          },
        ],
      },
      {
        model: db.FechaExamen,
        attributes: ["fechaExamen"],
        as: "FechaExamen",
        include: [
          {
            model: db.Condicion,
            attributes: ["nombre"],
            as: "Condicion",
          },
        ],
      },
      {
        model: db.Calificacion,
        attributes: ["calificacion", "aprobado"],
        as: "Calificacion",
      },
      {
        model: db.TurnoExamen,
        attributes: ["nombre", "id_ciclo"],
        as: "TurnoExamen",
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

exports.filtrarColoquioPorCurso = async (req, res, next) => {
  console.log("Filtrar inscripciones de coloquio por curso");
  const { id_ciclo, id_curso, id_division, id_materia, id_turno } = req.params;
  const id_condicion = 4; // Coloquio

  try {
    // Obtener los datos de los alumnos del curso
    const inscripcionCurso = await db.InscripcionCurso.findAll({
      where: {
        id_ciclo,
        id_curso,
        id_division,
      },
      attributes: ["id_alumno"],
    });

    if (inscripcionCurso.length === 0) {
      return res.json([]); // No hay alumnos inscritos en el curso
    }

    const id_alumnos = inscripcionCurso.map(
      (inscripcion) => inscripcion.id_alumno
    );
    //console.log('Alumnos del curso:', id_alumnos);

    // Filtrar en la tabla Previa
    const previas = await db.Previa.findAll({
      where: {
        id_alumno: id_alumnos,
        id_materia,
        id_condicion,
        id_curso,
        id_ciclo,
      },
      attributes: ["id_previa"],
    });

    if (previas.length === 0) {
      return res.json([]); // No hay previas para los alumnos del curso
    }

    const id_previas = previas.map((previa) => previa.id_previa);
    console.log("Previas encontradas:", id_previas.length);

    // Filtrar en la tabla Inscripcion
    const inscripciones = await db.Inscripcion.findAll({
      where: {
        id_previa: id_previas,
        id_turno,
      },
      include: [
        {
          model: db.Previa,
          as: "Previa", // Especificar el alias correcto
          include: [
            {
              model: db.Alumno,
              as: "Alumno", // Especificar el alias correcto
              attributes: ["id_alumno", "apellidos", "nombres", "dni"],
            },
          ],
        },
      ],
    });

    if (inscripciones.length === 0) {
      return res.json([]); // No hay inscripciones para las previas encontradas
    }

    console.log("Inscripciones encontradas:", inscripciones.length);

    // Ordenar los resultados por apellido y nombre
    inscripciones.sort((a, b) => {
      const apellidoA = a.Previa.Alumno.apellidos.toUpperCase();
      const apellidoB = b.Previa.Alumno.apellidos.toUpperCase();
      const nombreA = a.Previa.Alumno.nombres.toUpperCase();
      const nombreB = b.Previa.Alumno.nombres.toUpperCase();

      if (apellidoA < apellidoB) {
        return -1;
      } else if (apellidoA > apellidoB) {
        return 1;
      }
      if (nombreA < nombreB) {
        return -1;
      } else if (nombreA > nombreB) {
        return 1;
      }
      return 0;
    });

    res.json(inscripciones); // Enviar la respuesta JSON
  } catch (err) {
    console.error("Error al obtener las inscripciones:", err);
    next(err);
  }
};

exports.actualizarColoquioporcurso = async (req, res, next) => {
  const { alumnos } = req.body;
  const { id_materia, id_turno, id_ciclo, id_curso, id_division } = alumnos[0]; // Asegúrate de recibir estos datos del frontend

  console.log("Actualizar inscripciones de coloquio por curso");
  //console.log(alumnos);

  const id_condicion = 4; // Coloquio
  let id_fechaExamen;
  const id_calificacion = 1;
  const { id_plan } = await db.Curso.findOne({
    where: { id_curso },
    attributes: ["id_plan"],
  });

  console.log("Datos recibidos:", {
    id_materia,
    id_condicion,
    id_calificacion,
    id_curso,
    id_ciclo,
    id_plan,

    id_division,
    id_turno,
  });

  try {
    // Buscar la fecha de examen en la base de datos
    let fechaExamen = await db.FechaExamen.findOne({
      where: {
        id_turno,
        id_materia,
        id_condicion,
        id_curso,
        id_division,
      },
    });

    if (fechaExamen) {
      console.log("Fecha de examen encontrada:", fechaExamen);
      id_fechaExamen = fechaExamen.id_fechaExamen;
    } else {
      console.log(
        "No se encontró una fecha de examen para los criterios proporcionados."
      );
      // Crear una nueva fecha de examen
      const fechaActual = moment();
      console.log("Fecha actual:", fechaActual);
      fechaExamen = await db.FechaExamen.create({
        id_turno,
        id_materia,
        id_condicion,
        id_curso,
        id_division,
        fechaExamen: fechaActual, // Fecha y hora actuales
      });
      id_fechaExamen = fechaExamen.id_fechaExamen;
      console.log("Nueva fecha de examen creada:", id_fechaExamen);
    }

    // Buscar si tienen las previas cargadas de los alumnos del curso en la tabla Previa
    for (const alumno of alumnos) {
      const { id_alumno, coloquio } = alumno;

      const previa = await db.Previa.findOne({
        where: {
          id_alumno,
          id_materia,
          /*
          id_condicion,
          id_calificacion,
          id_curso,
          id_ciclo,
          id_plan,
          */
        },
      });

      if (coloquio) {
        if (previa) {
          console.log(
            `El alumno ${id_alumno} tiene su previa cargada: ${previa.id_previa}`
          );
          console.log(
            `Inscribir previa a examen de coloquio para el alumno ${id_alumno}`
          );
          if (
            previa.id_condicion !== id_condicion ||
            previa.id_ciclo !== id_ciclo ||
            previa.id_curso !== id_curso ||
            previa.id_plan !== id_plan
          ) {
            await db.Previa.update(
              {
                id_condicion,
                id_ciclo,
                id_curso,
                id_plan,
                id_calificacion, // Opcional: si la calificación inicial debe ser siempre 1
              },
              { where: { id_previa: previa.id_previa } }
            );
            console.log(
              `[ACTUALIZADO] Previa ID ${previa.id_previa} actualizada con el contexto actual.`
            );
          }
          // Verificar si ya existe una inscripción con la combinación de id_previa e id_turno
          const inscripcionExistente = await db.Inscripcion.findOne({
            where: {
              id_previa: previa.id_previa,
              id_turno,
            },
          });

          if (!inscripcionExistente) {
            // Inscribir la previa al examen de coloquio
            const inscripcion = await db.Inscripcion.create({
              id_previa: previa.id_previa,
              id_turno,
              id_fechaExamen,
            });
            console.log(
              `Inscripción creada con id: ${inscripcion.id_inscripcion}`
            );
          } else {
            console.log(`La inscripción ya existe para el alumno ${id_alumno}`);
          }
        } else {
          console.log(
            `El alumno ${id_alumno} no tiene cargada la previa (cargar previa)`
          );
          console.log(
            `Cargar previa e inscribir en examen de coloquio para el alumno ${id_alumno}`
          );
          // Cargar la previa
          const nuevaPrevia = await db.Previa.create({
            id_alumno,
            id_materia,
            id_condicion,
            id_calificacion,
            id_curso,
            id_ciclo,
            id_plan,
          });
          console.log(
            `Previa creada con id: ${nuevaPrevia.id_previa} para el alumno ${id_alumno}`
          );
          // Inscribir en el examen de coloquio
          const inscripcion = await db.Inscripcion.create({
            id_previa: nuevaPrevia.id_previa,
            id_turno,
            id_fechaExamen,
          });
          console.log(
            `Inscripción creada con id: ${inscripcion.id_inscripcion}`
          );
        }
      } else {
        if (previa) {
          console.log(
            `Eliminar previa ${previa.id_previa} para el alumno ${id_alumno}`
          );
          // Verificar si existe una inscripción con la combinación de id_previa e id_fechaExamen
          const inscripcionExistente = await db.Inscripcion.findOne({
            where: {
              id_previa: previa.id_previa,
              id_fechaExamen,
            },
          });

          if (inscripcionExistente) {
            // Eliminar la inscripción
            await db.Inscripcion.destroy({
              where: { id_inscripcion: inscripcionExistente.id_inscripcion },
            });
            console.log(
              `Inscripción eliminada con id: ${inscripcionExistente.id_inscripcion}`
            );
          }

          // Eliminar la previa
          await db.Previa.destroy({
            where: { id_previa: previa.id_previa },
          });
          console.log(`Previa eliminada con id: ${previa.id_previa}`);
        }
      }
    }

    // Aquí puedes agregar la lógica para actualizar las inscripciones en la base de datos.
    res.json({
      message: "Inscripciones actualizadas exitosamente",
      id_fechaExamen,
    });
  } catch (err) {
    console.error("Error al actualizar las inscripciones:", err);
    next(err);
  }
};

// Función para filtrar el permiso de examen
exports.filtrarPermisoExamen = async (req, res, next) => {
  // Recibir los parámetros de la solicitud (id_alumno, id_turno)
  const { id_alumno, id_turno } = req.params;

  // Pasar a integro id_turno
  const { generatePDF } = req.query; // Obtener el parámetro opcional de la consulta

  console.log("Filtrar permiso de examen");
  console.log("Datos recibidos:", {
    id_alumno,
    id_turno,
  });

  // Buscar todas las inscripciones del alumno, filtrando por id_alumno y id_turno utilizando try/catch y Ordenar los resultados por FechaExamen y generar el PDF porque es necesario
  try {
    const inscripciones = await db.Inscripcion.findAll({
      where: {
        id_turno,
      },
      include: [
        {
          model: db.TurnoExamen,
          as: "TurnoExamen",
          where: { id_turno },
          attributes: ["nombre"],
        },
        {
          model: db.Previa,
          as: "Previa",
          where: { id_alumno, id_condicion: [1, 2, 6] }, //  ORIGINAL where: { id_alumno,}
          include: [
            {
              model: db.Alumno,
              as: "Alumno",
              attributes: ["dni", "apellidos", "nombres"],
            },
            {
              model: db.Materia,
              as: "Materia",
            },
            {
              model: db.Condicion,
              as: "Condicion",
            },
            {
              model: db.Curso,
              as: "Curso",
              attributes: ["nombre"],
            },
            {
              model: db.Calificacion,
              as: "Calificacion",
              attributes: ["id_calificacion", "calificacion", "aprobado"],
            },
          ],
        },
        {
          model: db.FechaExamen,
          as: "FechaExamen",
        },
      ],
    });

    // Ordenar los resultados por FechaExamen
    inscripciones.sort((a, b) => {
      const fechaA = new Date(a.FechaExamen.fechaExamen);
      const fechaB = new Date(b.FechaExamen.fechaExamen);
      return fechaA - fechaB; // Ordenar de forma ascendente
    });

    // Mostrar en consola las inscripciones encontradas
    console.log("Inscripciones encontradas:", inscripciones.length);
    inscripciones.forEach((inscripcion) => {
      console.log(
        `Inscripción: ${inscripcion.id_inscripcion}, FechaExamen: ${inscripcion.FechaExamen.fechaExamen}`
      );
    });
    // Si se solicita generar un PDF, pasar los datos a JSON y continuar al siguiente middleware
    // Si no, enviar la respuesta JSON

    if (generatePDF) {
      // Pasar inscripciones a JSON
      const inscripcionesJSON = inscripciones.map((inscripcion) =>
        inscripcion.toJSON()
      );
      req.data = inscripcionesJSON; // Almacenar los datos en req.data
      next(); // Pasar al siguiente middleware para generar el PDF
    } else {
      res.json(inscripciones); // Enviar la respuesta JSON
    }
  } catch (err) {
    console.error("Error al filtrar el permiso de examen:", err);
    next(err);
  }
};

exports.cargarColoquiosMasivoArchivo = async (req, res, next) => {
  // Definiciones del Contexto y Constantes
  const db = require("../Models/index");
  const logger = console; // Usar el logger real de tu configuración (ej: require("../Config/logger"))

  let t;
  let totalRegistrosProcesados = 0;

  const ID_CONDICION_COLOQUIO = 4; // Condición: Coloquio
  const ID_CALIFICACION = 1; // Calificación: Aprobado (Valor por defecto para Previa)

  try {
    // 1. Iniciar Transacción
    t = await db.sequelize.transaction();

    const { id_turno: id_turno_body } = req.body;
    const file = req.file;

    // --- VALIDACIÓN DE ENTRADA (Antes del procesamiento) ---
    if (!file || file.mimetype !== "text/csv") {
      await t.rollback();
      logger.error(
        "Carga masiva rechazada: No se subió un archivo CSV válido."
      );
      return res.status(400).json({ message: "Debe subir un archivo CSV." });
    }

    const id_turno = parseInt(id_turno_body);
    if (isNaN(id_turno) || id_turno <= 0) {
      await t.rollback();
      logger.error(
        `Carga masiva rechazada: ID de Turno ${id_turno_body} no es válido.`
      );
      return res.status(400).json({ message: "El ID del turno es inválido." });
    }

    // 2. OBTENER ID_CICLO A PARTIR DEL ID_TURNO (Contexto principal)
    const turnoExamen = await db.TurnoExamen.findOne({
      where: { id_turno },
      attributes: ["id_ciclo"],
      transaction: t,
    });

    if (!turnoExamen || !turnoExamen.id_ciclo) {
      await t.rollback();
      logger.error(
        `Carga masiva rechazada: No se encontró el ciclo lectivo asociado al Turno ID ${id_turno}.`
      );
      return res.status(400).json({
        message: `El Turno de Examen seleccionado (ID ${id_turno}) no tiene un Ciclo Lectivo asociado.`,
      });
    }

    const id_ciclo_contexto = turnoExamen.id_ciclo;
    logger.info(
      `Contexto: Turno ${id_turno} asociado a Ciclo ${id_ciclo_contexto}.`
    );

    // 3. PROCESAMIENTO Y PARSEO DE CSV
    const batches = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.toLowerCase().trim(),
          })
        )
        .on("data", (data) => {
          // ESTE LOG NOS DIRÁ SI ESTÁ LEYENDO FILAS
          logger.warn(`[DEBUG-CSV-RAW] Fila leída: ${JSON.stringify(data)}`);
          const alumnosIdsString = data.alumnos_ids || "";

          const idMateria = data.id_materia ? parseInt(data.id_materia) : null;
          const idCurso = data.id_curso ? parseInt(data.id_curso) : null;
          const idCicloCSV = data.id_ciclo ? parseInt(data.id_ciclo) : null;
          const idDivision = data.id_division
            ? parseInt(data.id_division)
            : null;

          // 🛑 LOG DE DESCARTE (Motivo 1: Materia o Curso inválidos)
          if (!idMateria || isNaN(idMateria) || !idCurso || isNaN(idCurso)) {
            logger.warn(
              `[LOTE-SKIP-PARSING] Fila ignorada. Motivo: ID de Materia (${idMateria}) o ID de Curso (${idCurso}) no son válidos/numéricos. Fila: ${JSON.stringify(
                data
              )}`
            );
            return;
          }

          // 🛑 LOG DE DESCARTE (Motivo 2: No hay IDs de Alumno en el string)
          if (alumnosIdsString.length === 0) {
            logger.warn(
              `[LOTE-SKIP-PARSING] Fila ignorada. Materia ${idMateria}, Curso ${idCurso}. Motivo: La columna 'alumnos_ids' está vacía.`
            );
            return;
          }

          batches.push({
            id_turno: id_turno,
            id_docente: data.id_docente ? parseInt(data.id_docente) : null,
            id_materia: idMateria,
            id_curso: idCurso,
            id_division: idDivision,
            id_ciclo: idCicloCSV || id_ciclo_contexto, // Ciclo resuelto
            alumnos_ids_string: alumnosIdsString,
          });
        })
        .on("end", () => resolve())
        .on("error", (err) => {
          reject(new Error("FALLO_CRITICO_PARSING_CSV"));
        });
    });

    if (batches.length === 0) {
      await t.rollback();
      logger.error(
        "Carga masiva rechazada: El CSV no produjo lotes válidos para procesar."
      );
      return res.status(422).json({
        success: false,
        message:
          "El archivo fue leído, pero no se encontraron registros válidos para procesar. Verifique que las columnas y el contexto sean correctos.",
      });
    }

    // 4. PROCESAMIENTO DE LOTES E INSCRIPCIÓN (LÓGICA CORE)
    for (const batch of batches) {
      const {
        id_materia,
        id_curso,
        id_division,
        id_turno,
        id_ciclo,
        alumnos_ids_string,
      } = batch;

      // 🛑 LOG DE DESCARTE (Motivo 3: Falta contexto crítico en el lote)
      if (!id_materia || !id_curso || !id_turno || !id_division || !id_ciclo) {
        logger.error(
          `[LOTE-SKIP] Lote M:${id_materia} C:${id_curso} descartado. Motivo: Falta contexto CRÍTICO. Valores: DIV=${id_division}, CICLO=${id_ciclo}.`
        );
        continue;
      }

      const alumnosIdArray = alumnos_ids_string
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id) && id > 0);

      // 🛑 LOG DE DESCARTE (Motivo 4: No hay IDs de Alumno válidos para procesar)
      if (alumnosIdArray.length === 0) {
        logger.warn(
          `[LOTE-SKIP] Lote M:${id_materia} C:${id_curso} descartado. Motivo: La columna de alumnos (alumnos_ids) no contenía IDs válidos (>0).`
        );
        continue;
      }

      const alumnosParaProcesar = alumnosIdArray.map((id_alumno) => ({
        id_alumno,
      }));

      // 5.1. Gestión de FechaExamen (Contexto del Lote)
      let id_fechaExamen;

      let fechaExamen = await db.FechaExamen.findOne({
        where: {
          id_turno,
          id_materia,
          id_condicion: ID_CONDICION_COLOQUIO,
          id_curso,
          id_division,
        },
        transaction: t,
      });

      if (fechaExamen) {
        id_fechaExamen = fechaExamen.id_fechaExamen;
      } else {
        const fechaActual = moment();
        fechaExamen = await db.FechaExamen.create(
          {
            id_turno,
            id_materia,
            id_condicion: ID_CONDICION_COLOQUIO,
            id_curso,
            id_division,
            fechaExamen: fechaActual,
          },
          { transaction: t }
        );
        id_fechaExamen = fechaExamen.id_fechaExamen;
      }

      // Obtener id_plan desde la tabla Curso
      const cursoInfo = await db.Curso.findOne({
        where: { id_curso },
        attributes: ["id_plan"],
        transaction: t,
      });

      const id_plan = cursoInfo ? cursoInfo.id_plan : null;

      // 🛑 LOG DE DESCARTE (Motivo 5: No se puede obtener el Plan de Estudios del Curso)
      if (!id_plan) {
        logger.error(
          `[LOTE-SKIP] Lote M:${id_materia} C:${id_curso} descartado. Motivo: No se pudo obtener el ID_PLAN consultando el Curso ID ${id_curso}.`
        );
        continue;
      }

      // 5.2. Lógica de Marcar/Crear Previa e Inscripción
      for (const alumno of alumnosParaProcesar) {
        const { id_alumno } = alumno;
        let previaActualizada = false;

        // Buscar Previa SOLO por las claves únicas (id_alumno, id_materia)
        let previa = await db.Previa.findOne({
          where: { id_alumno, id_materia },
          transaction: t,
        });

        if (previa) {
          // CASO A: LA PREVIA EXISTE
          // 1. ✅ ACTUALIZAR id_ciclo, id_curso, id_plan, id_condicion

          const camposAActualizar = {};
          let requiereActualizacion = false;

          // Si la previa existe, le forzamos la actualización de su contexto
          if (previa.id_ciclo !== id_ciclo) {
            camposAActualizar.id_ciclo = id_ciclo;
            requiereActualizacion = true;
          }
          if (previa.id_curso !== id_curso) {
            camposAActualizar.id_curso = id_curso;
            requiereActualizacion = true;
          }
          if (previa.id_plan !== id_plan) {
            camposAActualizar.id_plan = id_plan;
            requiereActualizacion = true;
          }

          // Forzamos la condición a COLOQUIO (4) si no es la condición actual.
          if (previa.id_condicion !== ID_CONDICION_COLOQUIO) {
            camposAActualizar.id_condicion = ID_CONDICION_COLOQUIO;
            requiereActualizacion = true;
          }

          if (requiereActualizacion) {
            await previa.update(camposAActualizar, { transaction: t });
            previaActualizada = true;
            logger.info(
              `[INFO] Previa ID ${previa.id_previa} actualizada (Ciclo/Curso/Condición) para Alumno ${id_alumno}, Materia ${id_materia}.`
            );
          }

          // 2. Intentamos crear la Inscripción (si no existe ya para este turno)
          const inscripcionExistente = await db.Inscripcion.findOne({
            where: { id_previa: previa.id_previa, id_turno },
            transaction: t,
          });

          if (!inscripcionExistente) {
            await db.Inscripcion.create(
              { id_previa: previa.id_previa, id_turno, id_fechaExamen },
              { transaction: t }
            );
            totalRegistrosProcesados++;
            logger.info(
              `[INFO] Inscripción creada para Alumno ${id_alumno}, Materia ${id_materia}, Turno ${id_turno}.`
            );
          } else if (previaActualizada) {
            // Si la Inscripción ya existe, pero la Previa se actualizó, la contamos como procesada.
            totalRegistrosProcesados++;
            logger.info(
              `[INFO] Inscripción existente y Previa actualizada contada como procesada para Alumno ${id_alumno}, Materia ${id_materia}.`
            );
          }
        } else {
          // CASO B: LA PREVIA NO EXISTE (La creamos con TODOS los datos)
          const nuevaPrevia = await db.Previa.create(
            {
              id_alumno,
              id_materia,
              id_condicion: ID_CONDICION_COLOQUIO,
              id_calificacion: ID_CALIFICACION,
              id_curso,
              id_ciclo,
              id_plan,
            },
            { transaction: t }
          );

          await db.Inscripcion.create(
            { id_previa: nuevaPrevia.id_previa, id_turno, id_fechaExamen },
            { transaction: t }
          );
          totalRegistrosProcesados++;
          logger.info(
            `[INFO] Nueva Previa e Inscripción creadas para Alumno ${id_alumno}, Materia ${id_materia}.`
          );
        }
      }
    }

    // 6. Confirmar la Transacción y Responder
    await t.commit();

    logger.info(
      `Carga masiva completada: ${totalRegistrosProcesados} registros procesados.`
    );
    return res.status(201).json({
      success: true,
      message: `Carga masiva de inscripciones de coloquio completada. Total de registros procesados: ${totalRegistrosProcesados}.`,
      count: totalRegistrosProcesados,
    });
  } catch (error) {
    // --- MANEJO DE ERRORES CRÍTICOS ---
    if (t) await t.rollback();

    const errorStatus =
      error.message === "FALLO_CRITICO_PARSING_CSV" ? 422 : 500;
    const errorMessage =
      error.message === "FALLO_CRITICO_PARSING_CSV"
        ? "Error de formato o codificación del archivo CSV."
        : "Fallo crítico al procesar la carga masiva (revisar la conexión a BD o lógica de Sequelize).";

    logger.error(
      `[${errorStatus}] Fallo en cargarColoquiosMasivoArchivo:`,
      error
    );

    next({ status: errorStatus, message: errorMessage, originalError: error });
  }
};

function getCourseOrderValue(courseName, divisionName) {
  let order = 99; // Default alto para cursos no reconocidos
  let name = divisionName || "";

  // Intenta extraer el número del curso (ej: 1, 2, 3)
  const match = courseName.match(/(\d+)/);
  if (match) {
    order = parseInt(match[1], 10);
  }

  return { order, name };
}

exports.generarSabanaColoquiosPDF = async (req, res, next) => {
  const { id_turno, id_ciclo } = req.params;

  const turnoId = parseInt(id_turno);
  const cicloId = parseInt(id_ciclo);

  if (isNaN(turnoId) || isNaN(cicloId)) {
    logger.warn(
      `[400] Petición rechazada: ID de Turno (${id_turno}) o ID de Ciclo (${id_ciclo}) no son válidos.`
    );
    return res.status(400).json({
      message: "Los ID de Turno o Ciclo deben ser números válidos.",
    });
  }

  try {
    const ID_CONDICION_COLOQUIO = 4;

    // 1. OBTENER EL UNIVERSO COMPLETO DE CURSOS/DIVISIONES Y ALUMNOS (PADRÓN)
    const allInscripcionesCurso = await db.InscripcionCurso.findAll({
      where: { id_ciclo: cicloId },
      attributes: ["id_alumno", "id_curso", "id_division"],
      include: [
        {
          model: db.Alumno,
          as: "Alumno",
          attributes: ["id_alumno", "apellidos", "nombres"],
          required: true,
        },
        {
          model: db.Curso,
          as: "Curso",
          attributes: ["id_curso", "nombre"],
          required: true,
        },
        {
          model: db.Division,
          as: "Division",
          attributes: ["id_division", "nombre"],
          required: true,
        },
      ],
      raw: true, // Para facilitar el acceso a las propiedades
    });

    // 2. OBTENER DATOS DE COLOQUIO (SÓLO MARCAS)
    const inscripcionesColoquioData = await db.Inscripcion.findAll({
      where: { id_turno: turnoId },
      include: [
        {
          model: db.Previa,
          as: "Previa",
          where: {
            id_condicion: ID_CONDICION_COLOQUIO,
            id_ciclo: cicloId,
          },
          attributes: ["id_alumno", "id_materia", "id_curso"],
        },
        {
          model: db.FechaExamen,
          as: "FechaExamen",
          attributes: ["id_division"],
        },
      ],
      attributes: [], // Solo queremos las inclusiones
      raw: true,
    });

    // 3. MAPEO DE DATOS BASE Y GRUPOS ÚNICOS
    const allStudentsByCourseDivision = {};
    const divisionNames = {};
    const courseNamesMap = {};
    const uniqueGroupKeys = new Set();

    allInscripcionesCurso.forEach((ic) => {
      const id_curso = ic.id_curso;
      const id_division = ic.id_division;
      const key = `${id_curso}-${id_division}`;

      uniqueGroupKeys.add(key);

      // Mapeo de Nombres
      divisionNames[id_division] = ic["Division.nombre"];
      courseNamesMap[id_curso] = ic["Curso.nombre"];

      // Mapeo de Alumnos
      if (!allStudentsByCourseDivision[key]) {
        allStudentsByCourseDivision[key] = [];
      }
      allStudentsByCourseDivision[key].push({
        id: ic.id_alumno,
        // FORMATO CORREGIDO
        nombreCompleto: `${ic["Alumno.apellidos"]}, ${ic["Alumno.nombres"]}`,
      });
    });

    // 4. OBTENER TODAS las Materias POR CURSO
    let allMateriasByCourse = {};
    const uniqueCourseIds = [
      ...new Set(allInscripcionesCurso.map((ic) => ic.id_curso)),
    ];

    if (uniqueCourseIds.length > 0) {
      const allMaterias = await db.Materia.findAll({
        where: { id_curso: uniqueCourseIds },
        attributes: ["id_materia", "nombre", "id_curso"],
        order: [["nombre", "ASC"]],
      });
      allMaterias.forEach((m) => {
        const cursoId = m.id_curso;
        if (!allMateriasByCourse[cursoId]) {
          allMateriasByCourse[cursoId] = [];
        }
        allMateriasByCourse[cursoId].push({
          id: m.id_materia,
          nombre: m.nombre,
        });
      });
    }

    // 5. ORDENAMIENTO DE GRUPOS (1º A, 1º B, 2º A, etc.)
    const sortedGroupKeys = Array.from(uniqueGroupKeys).sort((keyA, keyB) => {
      const [id_cursoA, id_divisionA] = keyA.split("-");
      const [id_cursoB, id_divisionB] = keyB.split("-");

      const nameA = courseNamesMap[id_cursoA];
      const nameB = courseNamesMap[id_cursoB];
      const divA = divisionNames[id_divisionA];
      const divB = divisionNames[id_divisionB];

      const orderA = getCourseOrderValue(nameA, divA);
      const orderB = getCourseOrderValue(nameB, divB);

      // 1. Ordenar por número de curso (1, 2, 3...)
      if (orderA.order !== orderB.order) {
        return orderA.order - orderB.order;
      }
      // 2. Si el número es igual, ordenar por letra de división (A, B, C...)
      return orderA.name.localeCompare(orderB.name);
    });

    // 6. CONSTRUCCIÓN DE LA ESTRUCTURA FINAL Y CRUCE DE COLOQUIOS
    const listadoPorCursoDivision = {};

    // Mapear coloquios para búsqueda rápida: Key = "id_alumno-id_materia-id_curso-id_division"
    const coloquiosMap = new Set();
    inscripcionesColoquioData.forEach((ic) => {
      const previa = ic["Previa.id_alumno"] ? ic : null;
      if (previa) {
        const mapKey = `${ic["Previa.id_alumno"]}-${ic["Previa.id_materia"]}-${ic["Previa.id_curso"]}-${ic["FechaExamen.id_division"]}`;
        coloquiosMap.add(mapKey);
      }
    });

    // Iterar sobre los grupos ORDENADOS (incluyendo aquellos sin coloquios)
    for (const cursoDivisionKey of sortedGroupKeys) {
      const [id_curso, id_division] = cursoDivisionKey.split("-");
      const cursoNombre =
        courseNamesMap[id_curso] || `ID ${id_curso} (Desconocido)`;
      const divisionNombre =
        divisionNames[id_division] || `ID ${id_division} (Desconocido)`;

      // Estructura base para el grupo
      const grupo = {
        cursoNombre: cursoNombre,
        divisionNombre: divisionNombre,
        // Usar todas las materias para el curso, aun si no hay coloquios en ellas
        materiasColoquio: allMateriasByCourse[id_curso] || [],
        alumnos: [],
      };

      const alumnosDelGrupo =
        allStudentsByCourseDivision[cursoDivisionKey] || [];
      const alumnosList = [];

      // Llenar la lista de alumnos y cruzar con los coloquios
      alumnosDelGrupo.forEach((s) => {
        const alumnoInscripcion = {
          id: s.id,
          nombreCompleto: s.nombreCompleto,
          inscripciones: {},
        };

        grupo.materiasColoquio.forEach((materia) => {
          const mapKey = `${s.id}-${materia.id}-${id_curso}-${id_division}`;

          // Si el alumno está en coloquio para esta materia
          if (coloquiosMap.has(mapKey)) {
            alumnoInscripcion.inscripciones[materia.id] = "C";
          }
        });
        alumnosList.push(alumnoInscripcion);
      });

      // Ordenar los alumnos dentro del grupo
      grupo.alumnos = alumnosList.sort((a, b) =>
        a.nombreCompleto.localeCompare(b.nombreCompleto)
      );

      listadoPorCursoDivision[cursoDivisionKey] = grupo;
    }

    // --- 7. LLAMADA AL SERVICIO DE GENERACIÓN PDF ---
    const pdfBuffer = await generarPDF(listadoPorCursoDivision);

    // --- 8. Respuesta HTTP ---
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Sabana_Coloquios.pdf"'
    );
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(
      `[500] Fallo en generarSabanaColoquiosPDF (Turno: ${turnoId}, Ciclo: ${cicloId}):`,
      error
    );
    next({
      status: 500,
      message: "Error al generar la Sábana de coloquios.",
      originalError: error,
    });
  }
};
