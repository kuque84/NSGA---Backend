const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Materia = sequelize.define('Materia', {
    id_materia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos', // nombre de la tabla referenciada
        key: 'id_curso'
      }
    },
    id_plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'planes', // nombre de la tabla referenciada
        key: 'id_plan'
      }
    },
  }, {
    tableName: 'materias', // especificamos el nombre de la tabla
  });

  return Materia;
};