// Importamos los modelos de la base de datos
const db = require('../Models');

// Definimos un controlador para obtener la lista de todos los alumnos
exports.lista = (req, res, next) =>{
    // Utilizamos el método findAll de Sequelize para obtener todos los alumnos
    db.Alumno.findAll()
    .then(alumnos => {
        // Si la operación es exitosa, enviamos los alumnos como respuesta en formato JSON
        res.json(alumnos);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para filtrar los alumnos por un campo y valor específicos
exports.filtrar = (req, res, next) =>{
    // Obtenemos el campo y el valor de los parámetros de la ruta
    const campo = req.params.campo;
    const valor = req.params.valor;
    // Utilizamos el método findAll de Sequelize para obtener los alumnos que cumplen con el filtro
    db.Alumno.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(alumnos => {
        // Si la operación es exitosa, enviamos los alumnos como respuesta en formato JSON
        res.json(alumnos);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para crear un nuevo alumno
exports.nuevo = (req, res, next) =>{
    // Verificamos que los campos necesarios estén presentes en el cuerpo de la solicitud
    if(!req.body.nombres || !req.body.dni || !req.body.apellidos){
        // Si no están presentes, enviamos un mensaje de error con el estado 400
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    // Creamos un objeto con los datos del nuevo alumno
    const alumno = {
        dni: req.body.dni,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos
    }
    // Utilizamos el método create de Sequelize para crear el nuevo alumno
    db.Alumno.create(alumno)
    .then(data => {
        // Si la operación es exitosa, enviamos los datos del nuevo alumno como respuesta en formato JSON
        res.json(data);
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para actualizar un alumno
exports.actualizar = (req, res, next) =>{
    // Obtenemos el id del alumno de los parámetros de la ruta
    const id = req.params.id;
    // Utilizamos el método update de Sequelize para actualizar el alumno
    db.Alumno.update(req.body,{
        where: {dni: id}
    })
    .then(num => {
        // Si la operación es exitosa y se actualizó un alumno, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "alumno actualizado"
            });
        }else{
            // Si no se actualizó ningún alumno, enviamos un mensaje de error
            res.send({
                message: "No se pudo actualizar el alumno"
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}

// Definimos un controlador para eliminar un alumno
exports.eliminar = (req, res, next) =>{
    // Obtenemos el id del alumno de los parámetros de la ruta
    const id = req.params.id;
    // Utilizamos el método destroy de Sequelize para eliminar el alumno
    db.Alumno.destroy({
        where: {dni: id}
    })
    .then(num => {
        // Si la operación es exitosa y se eliminó un alumno, enviamos un mensaje de éxito
        if(num == 1){
            res.send({
                message: "alumno eliminado"
            });
        }else{
            // Si no se eliminó ningún alumno, enviamos un mensaje de error
            res.send({
                message: "No se pudo eliminar el alumno"
            });
        }
    }).catch(err => {
        next(err); // Pasamos el error al middleware de manejo de errores
    });
}