const db = require('../Models');


exports.lista = (req,res) =>{
    db.Division.findAll()
    .then(divisiones => {
        res.json(divisiones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los divisiones"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Division.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(divisiones => {
        res.json(divisiones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los divisiones"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.nombre){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const division = {
        nombre: req.body.nombre,
        id_curso: req.body.id_curso
    }
    db.Division.create(division)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el division"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Division.update(req.body,{
        where: {id_division: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "division actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el division"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el division"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar division con id: ${id}`);
    db.Division.destroy({
        where: {id_division: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "division eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el division"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el division"
        });
    });
}
