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
      dni_alumno: {
        type: DataTypes.STRING(12),
        allowNull: false,
        references: {
          model: "alumnos",
          key: "dni",
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
    }
  );

  return Previa;
};
