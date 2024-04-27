const db = require('../Models');


exports.lista = (req,res) =>{
    db.Plan.findAll()
    .then(Planes => {
        res.json(Planes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los Planes"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Plan.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(Planes => {
        res.json(Planes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los Planes"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.codigo || !req.body.descripcion){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const Plan = {
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        id_ciclo: req.body.id_ciclo
    }
    db.Plan.create(Plan)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el Plan"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Plan.update(req.body,{
        where: {id_plan: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "Plan actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el Plan"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el Plan"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar Plan con id: ${id}`);
    db.Plan.destroy({
        where: {id_plan: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "Plan eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el Plan"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el Plan"
        });
    });
}
