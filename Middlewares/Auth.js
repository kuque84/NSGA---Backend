// Importamos el módulo jsonwebtoken
const jwt = require("jsonwebtoken");

// Importamos la llave secreta desde la configuración del entorno
const llave = require("dotenv").config().parsed.SECRET_KEY;

//Importamos el logger
const logger = require("../Config/logger");

// Exportamos un middleware que verifica el token JWT
module.exports = (req, res, next) => {
  // Inicializamos el token a nulo
  let token = null; // 🛑 Variable unificada para el token

  // 1. LÓGICA DE COEXISTENCIA: Intentar obtener el token de ambas fuentes.

  // A. Fuente Existente (Header Authorization: Bearer <token>)
  const headerAuth = req.headers.authorization;
  if (headerAuth && headerAuth.startsWith("Bearer ")) {
    token = headerAuth.split(" ")[1]; // Extrae el token después de 'Bearer '
  }

  // B. Fuente Nueva (Query Parameter: ?token=<token>)
  else if (req.query.token) {
    token = req.query.token;
  }

  // 2. CHEQUEO: Si no se proporcionó el token en ninguna de las dos formas
  if (!token) {
    logger.error("No se proporcionó token.");
    res.status(401).send({
      message: "No se proporcionó token",
    });
    return;
  }

  // 3. VERIFICACIÓN: El flujo de verificación es ÚNICO y utiliza la variable 'token'
  jwt.verify(token, llave, (err, decoded) => {
    // Si hay un error (por ejemplo, el token es inválido), enviamos un mensaje de error
    if (err) {
      logger.error("Token inválido. ", err);
      res.status(401).send({
        message: "Token inválido",
      });
      return;
    } else {
      // Si el token es válido, lo decodificamos y lo adjuntamos a la solicitud
      req.decoded = decoded;
    }

    // Pasamos al siguiente middleware
    next();
  });
};
