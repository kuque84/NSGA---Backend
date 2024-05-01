// Importamos los modelos de la base de datos
const db = require('../Models');

// Definimos un controlador para obtener la lista de todas las divisiones
exports.lista = (req,res) =>{
    // Utilizamos el método findAll de Sequelize para obtener todas las divisiones
    db.Division.findAll()
    .then(divisiones => {
        // Si la operación es exitosa, enviamos las divisiones como respuesta en formato JSON
        res.json(divisiones);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con el estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las divisiones"
        });
    });
}

// Definimos un controlador para filtrar las divisiones por un campo y valor específicos
exports.filtrar = (req,res) =>{
    // Obtenemos el campo y el valor de los parámetros de la ruta
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Utilizamos el método findAll de Sequelize para obtener las divisiones que cumplen con el filtro
    db.Division.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(divisiones => {
        // Si la operación es exitosa, enviamos las divisiones como respuesta en formato JSON
        res.json(divisiones);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con el estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las divisiones"
        });
    });
}

// Definimos un controlador para crear una nueva división
exports.nuevo = (req,res) =>{
    // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.nombre){
        // Si no están presentes, enviamos un mensaje de error con el estado 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos de la nueva división
    const division = {
        nombre: req.body.nombre,
        id_curso: req.body.id_curso
    }
    // Utilizamos el método create de Sequelize para crear la nueva división
    db.Division.create(division)
    .then(data => {
        // Si la operación es exitosa, enviamos los datos de la nueva división como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con el estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear la división"
        });
    });
}

// Definimos un controlador para actualizar una división existente
exports.actualizar = (req,res) =>{
    // Obtenemos el id de la división de los parámetros de la ruta
    const id = req.params.id;
    // Utilizamos el método update de Sequelize para actualizar la división
    db.Division.update(req.body,{
        where: {id_division: id}
    })
    .then(num => {
        // Si la operación es exitosa y se actualizó una división, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "División actualizada"
            });
        }else{
            // Si no se actualizó ninguna división, enviamos un mensaje de error
            res.send({
                message: "No se pudo actualizar la división"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con el estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar la división"
        });
    });
}

// Definimos un controlador para eliminar una división existente
exports.eliminar = (req,res) =>{
    // Obtenemos el id de la división de los parámetros de la ruta
    const id = req.params.id;
    // Utilizamos el método destroy de Sequelize para eliminar la división
    db.Division.destroy({
        where: {id_division: id}
    })
    .then(num => {
        // Si la operación es exitosa y se eliminó una división, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "División eliminada"
            });
        }else{
            // Si no se eliminó ninguna división, enviamos un mensaje de error
            res.send({
                message: "No se pudo eliminar la división"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con el estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar la división"
        });
    });
}