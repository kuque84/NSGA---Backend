// Importamos el módulo de enrutamiento de Express
const Rutas = require("express").Router();

// Importamos el controlador de Inscripcion
const InscripcionController = require("../Controllers/Inscripcion.controller.js");

// Importamos el middleware de autenticación
const Auth = require("../Middlewares/Auth.js");

// Importamos Multer para manejo de archivos
const multer = require("multer");
// Configuración de Multer para almacenar el archivo en memoria (buffer)
// Esto es ideal para archivos pequeños/medianos que serán parseados inmediatamente.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Definimos una ruta GET para obtener la lista de Inscripcions
// Esta ruta requiere autenticación
Rutas.get("/lista", Auth, InscripcionController.lista);
//Rutas.get('/Inscripcion', Auth, InscripcionController.lista);

// Definimos una ruta GET para filtrar Inscripcions por un campo y valor específicos
// Esta ruta requiere autenticación
Rutas.get("/filtrar/:campo/:valor", Auth, InscripcionController.filtrar);
Rutas.get(
  "/filtrar/acta/:id_turno/:id_condicion/:id_materia",
  Auth,
  InscripcionController.filtrarActa
);
Rutas.get(
  "/filtrar/actaColoquio/:id_ciclo/:id_curso/:id_division/:id_turno/:id_condicion/:id_materia",
  Auth,
  InscripcionController.filtrarActaColoquio
);
/*
Rutas.get(
  '/filtrar/acta/:id_ciclo/:id_condicion/:id_materia',
  Auth,
  InscripcionController.filtrarActaNew
);
*/
Rutas.get("/rac/:id_alumno", Auth, InscripcionController.filtrarPorAlumno);

// Definimos una ruta POST para crear un nuevo Inscripcion
// Esta ruta no requiere autenticación
Rutas.post("/nuevo", Auth, InscripcionController.nuevo);

// Definimos una ruta POST para la carga masiva de inscripciones de coloquios
// CRÍTICO: Usamos 'upload.single('archivoColoquios')'
Rutas.post(
  "/cargar/coloquios/masivo",
  Auth, // Mantener el middleware de autenticación
  upload.single("archivoColoquios"), // <--- Este campo debe coincidir con el nombre enviado por el Frontend
  InscripcionController.cargarColoquiosMasivoArchivo // <--- Nuevo nombre de la función controladora
);

// Definimos una ruta PUT para actualizar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.put("/actualizar/:id", Auth, InscripcionController.actualizar);
Rutas.put("/acta", Auth, InscripcionController.actualizarActa);

Rutas.get(
  "/coloquioporcurso/:id_ciclo/:id_curso/:id_division/:id_materia/:id_turno",
  Auth,
  InscripcionController.filtrarColoquioPorCurso
);

Rutas.post(
  "/actualizarColoquioporcurso",
  Auth,
  InscripcionController.actualizarColoquioporcurso
);

// Definimos una ruta DELETE para eliminar un Inscripcion por su ID
// Esta ruta requiere autenticación
Rutas.delete("/eliminar/:id", Auth, InscripcionController.eliminar);

// Ruta para obtener la Sábana de Estudiantes a Coloquio en formato PDF.
// Requiere el ID del Turno y el ID del Ciclo para filtrar las previas.
Rutas.get(
  "/coloquios/sabana-pdf/:id_turno/:id_ciclo",
  Auth,
  InscripcionController.generarSabanaColoquiosPDF
);

// Exportamos las rutas
module.exports = Rutas;
