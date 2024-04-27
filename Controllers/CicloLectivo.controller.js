const db = require('../Models');

exports.lista = (req,res) =>{
    console.log("get ciclos lectivos");
    db.CicloLectivo.findAll()
    .then(ciclolectivos => {
        res.json(ciclolectivos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los ciclos lectivos"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.CicloLectivo.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(ciclolectivos => {
        res.json(ciclolectivos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los ciclos lectivos"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.anio){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const ciclolectivo = {
        anio: req.body.anio
    }
    db.CicloLectivo.create(ciclolectivo)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el ciclo lectivo"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.CicloLectivo.update(req.body,{
        where: {id: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "ciclo lectivo actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el ciclo lectivo"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el ciclo lectivo"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar ciclo lectivo con id: ${id}`);
    db.CicloLectivo.destroy({
        where: {id_ciclo: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "ciclo lectivo eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el ciclo lectivo"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el ciclo lectivo"
        });
    });
}
