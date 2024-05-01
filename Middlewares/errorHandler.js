// Definimos el middleware de manejo de errores
module.exports = (err, req, res, next) => {
    console.log(err); // Imprimimos el error en la consola
    console.error(err.stack); // Imprimimos el stack trace del error en la consola
    // Si el error es de tipo Error, enviamos un mensaje de error
    if (err instanceof Error) {
        res.status(500).send({
            message: err.message
        });
    } else {
        // Si no, enviamos un mensaje de error genérico
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor"
        });
    }
};
