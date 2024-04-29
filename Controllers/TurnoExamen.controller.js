const db = require('../Models');


exports.lista = (req,res) =>{
    db.TurnoExamen.findAll()
    .then(turnosExamen => {
        res.json(turnosExamen);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los turnos de examen"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.TurnoExamen.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(turnosExamen => {
        res.json(turnosExamen);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los turnos de examen"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.nombre || !req.body.id_condicion){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const turnoExamen = {
        nombre: req.body.nombre,
        id_condicion: req.body.id_condicion
    }
    db.TurnoExamen.create(turnoExamen)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: `Error: ${err.message}` || "Ocurrió un error al crear el turno de examen"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.TurnoExamen.update(req.body,{
        where: {id_turnoExamen: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "turnoExamen actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el turno de examen"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el turno de examen"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar turnoExamen con id: ${id}`);
    db.TurnoExamen.destroy({
        where: {id_turnoExamen: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "turnoExamen eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el turno de examen"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el turno de examen"
        });
    });
}
