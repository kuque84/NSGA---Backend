// Importamos el objeto DataTypes de la biblioteca sequelize. 
const { DataTypes } = require('sequelize');

// Exportamos una función que toma una instancia de Sequelize y define un modelo en ella.
module.exports = (sequelize) => {

  // Definimos un nuevo modelo llamado 'Rol'. Los modelos en Sequelize representan tablas en la base de datos.
  const Rol = sequelize.define('Rol', {

    // Definimos el campo 'id_Rol'. Este es el campo de clave primaria de la tabla.
    // Está configurado para autoincrementarse, lo que significa que cada vez que se crea una nueva fila, este campo se incrementará automáticamente a partir del último valor de 'id_Rol'.
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rol: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
  },{
    // Especificamos el nombre de la tabla en la base de datos.
    tableName: 'roles',
  });

  // Devolvemos el modelo 'Rol' definido, permitiendo que sea utilizado en otras partes de nuestra aplicación.
  return Rol;
};