const db = require('../Models');


exports.lista = (req,res) =>{
    db.Curso.findAll()
    .then(cursos => {
        res.json(cursos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los cursos"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Curso.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(cursos => {
        res.json(cursos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los cursos"
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
    const curso = {
        nombre: req.body.nombre,
        id_plan: req.body.id_plan
    }
    db.Curso.create(curso)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el curso"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Curso.update(req.body,{
        where: {id_curso: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "curso actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el curso"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el curso"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    console.log(`Eliminar curso con id: ${id}`);
    db.Curso.destroy({
        where: {id_curso: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "curso eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el curso"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el curso"
        });
    });
}
