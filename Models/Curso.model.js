const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Curso = sequelize.define('Curso', {
        id_curso: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_plan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'planes',
                key: 'id_plan'
            }
        },
        nombre: {
            type: DataTypes.STRING(2),
            allowNull: false,
        }
    }, {
        tableName: 'cursos',
    });



    return Curso;
};
