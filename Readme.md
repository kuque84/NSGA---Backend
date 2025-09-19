# NSGA Backend

Backend del sistema NSGA, desarrollado en Node.js con Express y Sequelize para la gestión académica.

## Características

- API RESTful para gestión académica (alumnos, exámenes, ciclos lectivos, etc.)
- Autenticación y autorización
- Manejo de errores centralizado
- Logger personalizado con Winston
- Variables de entorno para configuración
- Conexión a base de datos MySQL

## Requisitos

- Node.js >= 16
- MySQL

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/NSGA---Backend.git
   cd NSGA---Backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura el archivo `.env`:

   ```env
   PORT=3000
   SECRET_KEY=tu_clave_secreta
   DB_HOST=localhost
   DB_USER=usuario_mysql
   DB_PASSWORD=contraseña_mysql
   DB_NAME=nsgaDb
   DB_DIALECT=mysql
   DB_PORT=3306
   DB_POOL_MAX=15
   DB_POOL_MIN=0
   DB_POOL_ACQUIRE=30000
   DB_POOL_IDLE=10000
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

## Endpoints principales

- `GET /health` — Verifica el estado del servidor
- Otros endpoints disponibles en `/Routers/index.routes.js`

## Estructura

- `/Controllers` — Lógica de negocio
- `/Models` — Modelos de Sequelize
- `/Routers` — Definición de rutas
- `/Config` — Configuración de CORS, logger, etc.
- `/Middlewares` — Middlewares personalizados

## Licencia

MIT
