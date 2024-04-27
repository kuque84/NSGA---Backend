const db = require('../Models');


exports.lista = (req,res) =>{
    db.Calificacion.findAll()
    .then(calificaciones => {
        res.json(calificaciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los calificaciones"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Calificacion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(calificaciones => {
        res.json(calificaciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los calificaciones"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.calificacion || req.body.aprobado === undefined){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const calificacion = {
        calificacion: req.body.calificacion,
        aprobado: req.body.aprobado
    }
    db.Calificacion.create(calificacion)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el calificacion"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Calificacion.update(req.body,{
        where: {id_calificacion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "calificacion actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el calificacion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el calificacion"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar calificacion con id: ${id}`);
    db.Calificacion.destroy({
        where: {id_calificacion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "calificacion eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el calificacion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el calificacion"
        });
    });
}
