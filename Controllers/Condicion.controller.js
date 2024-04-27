const db = require('../Models');


exports.lista = (req,res) =>{
    db.Condicion.findAll()
    .then(condiciones => {
        res.json(condiciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los condiciones"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Condicion.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(condiciones => {
        res.json(condiciones);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los condiciones"
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
    const condicion = {
        nombre: req.body.nombre
    }
    db.Condicion.create(condicion)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el condicion"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Condicion.update(req.body,{
        where: {id_condicion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "condicion actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el condicion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el condicion"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar condicion con id: ${id}`);
    db.Condicion.destroy({
        where: {id_condicion: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "condicion eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el condicion"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el condicion"
        });
    });
}
