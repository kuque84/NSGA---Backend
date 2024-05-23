const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Previa = sequelize.define(
    "Previa",
    {
      id_previa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "alumnos",
          key: "id_alumno",
        },
      },
      id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "materias",
          key: "id_materia",
        },
      },
      id_condicion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "condiciones",
          key: "id_condicion",
        },
      },
      aprobado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "previas",
      indexes: [
        {
          unique: true,
          fields: ['id_alumno', 'id_materia']
        }
      ]
    }
  );

  return Previa;
};