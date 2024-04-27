const db = require('../Models');


exports.lista = (req,res) =>{
    db.Materia.findAll()
    .then(materias => {
        res.json(materias);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los materias"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Materia.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(materias => {
        res.json(materias);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los materias"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.nombre || !req.body.id_curso){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const materia = {
        nombre: req.body.nombre,
        area: req.body.area,
        id_curso: req.body.id_curso
    }
    db.Materia.create(materia)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el materia"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Materia.update(req.body,{
        where: {id_materia: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "materia actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el materia"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el materia"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar materia con id: ${id}`);
    db.Materia.destroy({
        where: {id_materia: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "materia eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el materia"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el materia"
        });
    });
}
