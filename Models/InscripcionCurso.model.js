const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InscripcionCurso = sequelize.define(
    "InscripcionCurso",
    {
      id_inscripcion_curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_ciclo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "cicloLectivos",
          key: "id_ciclo",
        },
      },
      id_plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "planes",
          key: "id_plan",
        },
      },
      id_curso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "cursos",
          key: "id_curso",
        },
        onDelete: "CASCADE",
      },
      id_division: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "divisiones",
          key: "id_division",
        },
      },
      id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "alumnos",
          key: "id_alumno",
        },
      },
    },
    {
      tableName: "inscripciones_cursos",
      indexes: [
        {
          unique: true,
          fields: ["id_ciclo", "id_alumno"],
        },
      ],
      //timestamps: false,
    }
  );

  return InscripcionCurso;
};
