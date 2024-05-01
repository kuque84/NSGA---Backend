// Importamos el modelo de la base de datos
const db = require('../Models');

// Función para obtener la lista de todas las inscripciones
exports.lista = (req,res) =>{
    // Buscamos todas las inscripciones en la base de datos
    db.Inscripcion.findAll()
    .then(inscripciones => {
        // Si la búsqueda es exitosa, devolvemos las inscripciones como respuesta en formato JSON
        res.json(inscripciones);
    }).catch(err => {
        // Si ocurre un error, devolvemos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las inscripciones"
        });
    });
}

// Función para filtrar las inscripciones por un campo específico
exports.filtrar = (req,res) =>{
    // Obtenemos el campo y el valor por el cual filtrar de los parámetros de la solicitud
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Buscamos todas las inscripciones que coincidan con el filtro
    db.Inscripcion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(inscripciones => {
        // Si la búsqueda es exitosa, devolvemos las inscripciones filtradas como respuesta en formato JSON
        res.json(inscripciones);
    }).catch(err => {
        // Si ocurre un error, devolvemos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las inscripciones"
        });
    });
}

// Función para crear una nueva inscripción
exports.nuevo = (req,res) =>{
    // Verificamos que todos los campos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.id_previa || !req.body.id_turno || !req.body.id_fechaExamen || !req.body.id_calificacion || !req.body.libro || !req.body.folio){
        // Si falta algún campo, devolvemos un mensaje de error con un código de estado 400
        res.status(400).send({
            message: "Faltan datos"
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
        folio: req.body.folio
    }
    // Creamos la nueva inscripción en la base de datos
    db.Inscripcion.create(inscripcion)
    .then(data => {
        // Si la creación es exitosa, devolvemos los datos de la nueva inscripción como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        // Si ocurre un error, devolvemos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear la inscripcion"
        });
    });
}

// Función para actualizar una inscripción existente
exports.actualizar = (req,res) =>{
    // Obtenemos el id de la inscripción a actualizar de los parámetros de la solicitud
    const id = req.params.id;
    // Actualizamos la inscripción en la base de datos con los datos presentes en el cuerpo de la solicitud
    db.Inscripcion.update(req.body,{
        where: {id_inscripcion: id}
    })
    .then(num => {
        // Si la actualización es exitosa, devolvemos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "inscripcion actualizado"
            });
        }else{
            // Si no se pudo actualizar la inscripción, devolvemos un mensaje de error
            res.send({
                message: "No se pudo actualizar la inscripcion"
            });
        }
    }).catch(err => {
        // Si ocurre un error, devolvemos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar la inscripcion"
        });
    });
}

// Función para eliminar una inscripción existente
exports.eliminar = (req,res) =>{
    // Obtenemos el id de la inscripción a eliminar de los parámetros de la solicitud
    const id = req.params.id;
    // Imprimimos un mensaje en la consola indicando el id de la inscripción a eliminar
    console.log(`Eliminar inscripcion con id: ${id}`);
    // Eliminamos la inscripción de la base de datos
    db.Inscripcion.destroy({
        where: {id_inscripcion: id}
    })
    .then(num => {
        // Si la eliminación es exitosa, devolvemos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "inscripcion eliminado"
            });
        }else{
            // Si no se pudo eliminar la inscripción, devolvemos un mensaje de error
            res.send({
                message: "No se pudo eliminar la inscripcion"
            });
        }
    }).catch(err => {
        // Si ocurre un error, devolvemos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar la inscripcion"
        });
    });
}