// Importamos el modelo de la base de datos
const db = require('../Models');

// Función para obtener la lista de todos los planes
exports.lista = (req,res) =>{
    // Usamos el método findAll de Sequelize para obtener todos los planes
    db.Plan.findAll()
    .then(Planes => {
        // Si la operación es exitosa, devolvemos los planes como respuesta JSON
        res.json(Planes);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los Planes"
        });
    });
}

// Función para filtrar planes por un campo específico
exports.filtrar = (req,res) =>{
    // Obtenemos el campo y el valor de los parámetros de la solicitud
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Buscamos todos los planes que coinciden con el valor en el campo especificado
    db.Plan.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(Planes => {
        // Si la operación es exitosa, devolvemos los planes como respuesta JSON
        res.json(Planes);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los Planes"
        });
    });
}

// Función para crear un nuevo plan
exports.nuevo = (req,res) =>{
    // Verificamos que los datos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.codigo || !req.body.descripcion){
        // Si faltan datos, enviamos un mensaje de error con un código de estado 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos del nuevo plan
    const Plan = {
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        id_ciclo: req.body.id_ciclo
    }
    // Usamos el método create de Sequelize para crear el nuevo plan
    db.Plan.create(Plan)
    .then(data => {
        // Si la operación es exitosa, devolvemos los datos del nuevo plan como respuesta JSON
        res.json(data);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el Plan"
        });
    });
}

// Función para actualizar un plan existente
exports.actualizar = (req,res) =>{
    // Obtenemos el ID del plan de los parámetros de la solicitud
    const id = req.params.id;
    // Usamos el método update de Sequelize para actualizar el plan
    db.Plan.update(req.body,{
        where: {id_plan: id}
    })
    .then(num => {
        // Si la operación es exitosa, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "Plan actualizado"
            });
        }else{
            // Si no se pudo actualizar el plan, enviamos un mensaje de error
            res.send({
                message: "No se pudo actualizar el Plan"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el Plan"
        });
    });
}

// Función para eliminar un plan existente
exports.eliminar = (req,res) =>{
    // Obtenemos el ID del plan de los parámetros de la solicitud
    const id = req.params.id;
    // Imprimimos un mensaje en la consola indicando que vamos a eliminar el plan
    console.log(`Eliminar Plan con id: ${id}`);
    // Usamos el método destroy de Sequelize para eliminar el plan
    db.Plan.destroy({
        where: {id_plan: id}
    })
    .then(num => {
        // Si la operación es exitosa, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "Plan eliminado"
            });
        }else{
            // Si no se pudo eliminar el plan, enviamos un mensaje de error
            res.send({
                message: "No se pudo eliminar el Plan"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el Plan"
        });
    });
}