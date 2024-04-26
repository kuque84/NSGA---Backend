const db = require('../Models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const llave = require('../Config/env').llave;

exports.lista = (req,res) =>{
    db.Usuario.findAll()
    .then(usuarios => {
        res.json(usuarios);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los usuarios"
        });
    });
}

exports.filtrar = (req,res) =>{
    const campo = req.params.campo;
    const valor = req.params.valor;
    db.Usuario.findAll({
        where: {
            [campo]: valor
        }
    })
    .then(usuarios => {
        res.json(usuarios);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al obtener los usuarios"
        });
    });
}

exports.nuevo = (req,res) =>{
    if(!req.body.nombre || !req.body.email || !req.body.password){
        res.status(400).send({
            message: "Faltan datos"
        });
        return;
    }
    const usuario = {
        nombre: req.body.nombre,
        email: req.body.email,
        dni: req.body.dni,
        password: bcrypt.hashSync(req.body.password, 8)
    }
    db.Usuario.create(usuario)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el usuario"
        });
    });
}

exports.actualizar = (req,res) =>{
    const id = req.params.id;
    db.Usuario.update(req.body,{
        where: {id: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "Usuario actualizado"
            });
        }else{
            res.send({
                message: "No se pudo actualizar el usuario"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al actualizar el usuario"
        });
    });
}

exports.eliminar = (req,res) =>{
    const id = req.params.id;
    db.Usuario.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: "Usuario eliminado"
            });
        }else{
            res.send({
                message: "No se pudo eliminar el usuario"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al eliminar el usuario"
        });
    });
}

exports.login = (req,res) =>{
    db.Usuario.findOne({
        where: {
            dni: req.body.dni
        }
    })
    .then(usuario => {
        if(!usuario){
            res.status(404).send({
                message: "Usuario no encontrado"
            });
            return;
        }
        const passwordValido = bcrypt.compareSync(req.body.password, usuario.password);
        if(!passwordValido){
            res.status(401).send({
                message: "Contraseña incorrecta"
            });
            return;
        }
        const token = jwt.sign({id: usuario.id}, llave, {
            expiresIn: '24h'
        });
        res.json({
            usuario: usuario,
            token: token
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió un error al iniciar sesión"
        });
    });
}