// Importamos los modelos de la base de datos
const db = require('../Models');

// Definimos un controlador para obtener la lista de todas las condiciones
exports.lista = (req, res, next) =>{
    // Utilizamos el método findAll de Sequelize para obtener todas las condiciones
    db.Condicion.findAll()
    .then(condiciones => {
        // Si la operación es exitosa, enviamos las condiciones como respuesta en formato JSON
        res.json(condiciones);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para filtrar las condiciones por un campo y valor específicos
exports.filtrar = (req, res, next) =>{
    // Obtenemos el campo y el valor de los parámetros de la ruta
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Utilizamos el método findAll de Sequelize para obtener las condiciones que cumplen con el filtro
    db.Condicion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(condiciones => {
        // Si la operación es exitosa, enviamos las condiciones como respuesta en formato JSON
        res.json(condiciones);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para crear una nueva condición
exports.nuevo = (req, res, next) =>{
    // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.nombre){
        // Si no están presentes, enviamos un mensaje de error con el estado 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos de la nueva condición
    const condicion = {
        nombre: req.body.nombre
    }
    // Utilizamos el método create de Sequelize para crear la nueva condición
    db.Condicion.create(condicion)
    .then(data => {
        // Si la operación es exitosa, enviamos los datos de la nueva condición como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para actualizar una condición existente
exports.actualizar = (req, res, next) => {
    // Obtenemos el ID de la condición de los parámetros de la ruta
    const id = req.params.id;

    // Utilizamos el método update de Sequelize para actualizar la condición
    db.Condicion.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            // Si la operación es exitosa, enviamos un mensaje de éxito
            res.send({
                message: "La condición fue actualizada exitosamente."
            });
        } else {
            // Si no se actualizó ninguna condición, enviamos un mensaje de error
            res.send({
                message: `No se pudo actualizar la condición con ID=${id}.`
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
};

// Definimos un controlador para eliminar una condición existente
exports.eliminar = (req, res, next) => {
    // Obtenemos el ID de la condición de los parámetros de la ruta
    const id = req.params.id;

    // Utilizamos el método destroy de Sequelize para eliminar la condición
    db.Condicion.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            // Si la operación es exitosa, enviamos un mensaje de éxito
            res.send({
                message: "La condición fue eliminada exitosamente."
            });
        } else {
            // Si no se eliminó ninguna condición, enviamos un mensaje de error
            res.send({
                message: `No se pudo eliminar la condición con ID=${id}.`
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
};