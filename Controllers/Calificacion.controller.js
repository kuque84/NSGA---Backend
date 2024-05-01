// Importamos los modelos de la base de datos
const db = require('../Models');

// Definimos un controlador para obtener la lista de todas las calificaciones
exports.lista = (req, res, next) =>{
    // Utilizamos el método findAll de Sequelize para obtener todas las calificaciones
    db.Calificacion.findAll()
    .then(calificaciones => {
        // Si la operación es exitosa, enviamos las calificaciones como respuesta en formato JSON
        res.json(calificaciones);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para filtrar las calificaciones por un campo y valor específicos
exports.filtrar = (req, res, next) =>{
    // Obtenemos el campo y el valor de los parámetros de la ruta
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Utilizamos el método findAll de Sequelize para obtener las calificaciones que cumplen con el filtro
    db.Calificacion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(calificaciones => {
        // Si la operación es exitosa, enviamos las calificaciones como respuesta en formato JSON
        res.json(calificaciones);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para crear una nueva calificación
exports.nuevo = (req, res, next) =>{
    // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.calificacion || req.body.aprobado === undefined){
        // Si no están presentes, enviamos un mensaje de error con el estado 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos de la nueva calificación
    const calificacion = {
        calificacion: req.body.calificacion,
        aprobado: req.body.aprobado
    }
    // Utilizamos el método create de Sequelize para crear la nueva calificación
    db.Calificacion.create(calificacion)
    .then(data => {
        // Si la operación es exitosa, enviamos los datos de la nueva calificación como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para actualizar una calificación
exports.actualizar = (req, res, next) =>{
    // Obtenemos el id de la calificación de los parámetros de la ruta
    const id = req.params.id;
    // Utilizamos el método update de Sequelize para actualizar la calificación
    db.Calificacion.update(req.body,{
        where: {id_calificacion: id}
    })
    .then(num => {
        // Si la operación es exitosa y se actualizó una calificación, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "calificacion actualizada"
            });
        }else{
            // Si no se actualizó ninguna calificación, enviamos un mensaje de error
            res.send({
                message: "No se pudo actualizar la calificación"
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para eliminar una calificación
exports.eliminar = (req, res, next) =>{
    // Obtenemos el id de la calificación de los parámetros de la ruta
    const id = req.params.id;
    // Imprimimos un mensaje en la consola indicando que se va a eliminar la calificación con el id especificado
    console.log(`Eliminar calificación con id: ${id}`);
    // Utilizamos el método destroy de Sequelize para eliminar la calificación
    db.Calificacion.destroy({
        where: {id_calificacion: id}
    })
    .then(num => {
        // Si la operación es exitosa y se eliminó una calificación, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "calificación eliminada"
            });
        }else{
            // Si no se eliminó ninguna calificación, enviamos un mensaje de error
            res.send({
                message: "No se pudo eliminar la calificación"
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}