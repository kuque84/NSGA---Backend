const db = require('../Models');


exports.lista = (req,res) =>{
    db.Previa.findAll()
    .then(previas => {
        res.json(previas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las previas"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Previa.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(previas => {
        res.json(previas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las previas"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.dni_alumno || !req.body.id_condicion || !req.body.id_materia){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const previa = {
        dni_alumno: req.body.dni_alumno,
        id_condicion: req.body.id_condicion,
        id_materia: req.body.id_materia,
        aprobado: req.body.aprobado ? req.body.aprobado : false
    }
    db.Previa.create(previa)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear la previa"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Previa.update(req.body,{
        where: {id_previa: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "previa actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar la previa"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar la previa"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar previa con id: ${id}`);
    db.Previa.destroy({
        where: {id_previa: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "previa eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar la previa"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar la previa"
        });
    });
}
