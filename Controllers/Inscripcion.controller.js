const db = require("../Models");
const { Sequelize, where } = require("sequelize");
const moment = require("moment"); // Importa la librería moment

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
          id_condicion,
          id_calificacion,
          id_curso,
          id_ciclo,
          id_plan,
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
          where: { id_alumno },
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
