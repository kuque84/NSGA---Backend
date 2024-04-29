const db = require('../Models');


exports.lista = (req,res) =>{
    db.FechaExamen.findAll()
    .then(fechasExamen => {
        res.json(fechasExamen);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las fechas de examen"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.FechaExamen.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(fechasExamen => {
        res.json(fechasExamen);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las fechas de examen"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.fechaExamen || !req.body.id_turno || !req.body.id_materia){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const fechaExamen = {
        fechaExamen: req.body.fechaExamen,
        id_turno: req.body.id_turno,
        id_materia: req.body.id_materia
    }
    db.FechaExamen.create(fechaExamen)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear la fecha de examen"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.FechaExamen.update(req.body,{
        where: {id_fechaExamen: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "fechaExamen actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar la fecha de examen"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar la fecha de examen"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar fechaExamen con id: ${id}`);
    db.FechaExamen.destroy({
        where: {id_fechaExamen: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "fechaExamen eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar la fecha de examen"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar la fecha de examen"
        });
    });
}
