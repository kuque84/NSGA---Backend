// Importamos el objeto 'db' que contiene los modelos de la base de datos
const db = require('../Models');

// Definimos el método 'lista' que se encargará de obtener todas las instancias de 'Rol'
exports.lista = (req,res) =>{
    // Utilizamos el método 'findAll' de Sequelize para obtener todas las instancias de 'Rol'
    db.Rol.findAll()
    .then(roles => {
        // Si la operación es exitosa, enviamos las instancias obtenidas como respuesta en formato JSON
        res.json(roles);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado HTTP 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los roles"
        });
    });
}

// Definimos el método 'filtrar' que se encargará de obtener las instancias de 'Rol' que coincidan con un valor específico en un campo específico
exports.filtrar = (req,res) =>{
    // Obtenemos el campo y el valor de los parámetros de la ruta de la solicitud HTTP
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Utilizamos el método 'findAll' de Sequelize para obtener las instancias de 'Rol' que tienen ese valor en ese campo
    db.Rol.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(roles => {
        // Si la operación es exitosa, enviamos las instancias obtenidas como respuesta en formato JSON
        res.json(roles);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado HTTP 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los roles"
        });
    });
}

// Definimos el método 'nuevo' que se encargará de crear una nueva instancia de 'Rol'
exports.nuevo = (req,res) =>{
    // Verificamos que los datos necesarios estén presentes en el cuerpo de la solicitud HTTP
    if(!req.body.nombre){
        // Si faltan datos, enviamos un mensaje de error con un código de estado HTTP 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos de la nueva instancia
    const rol = {
        nombre: req.body.nombre,
        id_plan: req.body.id_plan
    }
    // Utilizamos el método 'create' de Sequelize para crear la nueva instancia en la base de datos
    db.Rol.create(rol)
    .then(data => {
        // Si la operación es exitosa, enviamos la nueva instancia como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado HTTP 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el rol"
        });
    });
}

// Definimos el método 'actualizar' que se encargará de actualizar una instancia existente de 'Rol'
exports.actualizar = (req,res) =>{
    // Obtenemos el ID de los parámetros de la ruta de la solicitud HTTP
    const id = req.params.id;
    // Utilizamos el método 'update' de Sequelize para actualizar la instancia en la base de datos
    db.Rol.update(req.body,{
        where: {id_rol: id}
    })
    .then(num => {
        // Si la operación es exitosa y se actualizó una instancia, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "rol actualizado"
            });
        }else{
            // Si no se pudo actualizar la instancia, enviamos un mensaje de error
            res.send({
                message: "No se pudo actualizar el rol"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado HTTP 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el rol"
        });
    });
}

// Definimos el método 'eliminar' que se encargará de eliminar una instancia existente de 'Rol'
exports.eliminar = (req,res) =>{
    // Obtenemos el ID de los parámetros de la ruta de la solicitud HTTP
    const id = req.params.id;
    // Imprimimos un mensaje en la consola indicando que se intentará eliminar la instancia con ese ID
    console.log(`Eliminar rol con id: ${id}`);
    // Utilizamos el método 'destroy' de Sequelize para eliminar la instancia en la base de datos
    db.Rol.destroy({
        where: {id_rol: id}
    })
    .then(num => {
        // Si la operación es exitosa y se eliminó una instancia, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "rol eliminado"
            });
        }else{
            // Si no se pudo eliminar la instancia, enviamos un mensaje de error
            res.send({
                message: "No se pudo eliminar el rol"
            });
        }
    }).catch(err => {
        // Si ocurre un error, enviamos un mensaje de error con un código de estado HTTP 500
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el rol"
        });
    });
}