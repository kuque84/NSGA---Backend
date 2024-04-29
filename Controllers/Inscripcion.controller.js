const db = require('../Models');


exports.lista = (req,res) =>{
    db.Inscripcion.findAll()
    .then(inscripciones => {
        res.json(inscripciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las inscripciones"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Inscripcion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(inscripciones => {
        res.json(inscripciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener las inscripciones"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.id_previa || !req.body.id_turno || !req.body.id_fechaExamen || !req.body.id_calificacion || !req.body.libro || !req.body.folio){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const inscripcion = {
        id_previa: req.body.id_previa,
        id_turno: req.body.id_turno,
        id_fechaExamen: req.body.id_fechaExamen,
        id_calificacion: req.body.id_calificacion,
        libro: req.body.libro,
        folio: req.body.folio
    }
    db.Inscripcion.create(inscripcion)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear la inscripcion"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Inscripcion.update(req.body,{
        where: {id_inscripcion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "inscripcion actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar la inscripcion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar la inscripcion"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar inscripcion con id: ${id}`);
    db.Inscripcion.destroy({
        where: {id_inscripcion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "inscripcion eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar la inscripcion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar la inscripcion"
        });
    });
}
