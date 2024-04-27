const db = require('../Models');


exports.lista = (req,res) =>{
    db.Alumno.findAll()
    .then(alumnos => {
        res.json(alumnos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los alumnos"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Alumno.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(alumnos => {
        res.json(alumnos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los alumnos"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.nombres || !req.body.dni || !req.body.apellidos){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const alumno = {
        dni: req.body.dni,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos
    }
    db.Alumno.create(alumno)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el alumno"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Alumno.update(req.body,{
        where: {dni: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "alumno actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el alumno"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el alumno"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar alumno con id: ${id}`);
    db.Alumno.destroy({
        where: {dni: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "alumno eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el alumno"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el alumno"
        });
    });
}
