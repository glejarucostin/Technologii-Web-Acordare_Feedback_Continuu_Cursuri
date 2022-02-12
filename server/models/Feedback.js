const sequelize = require('../database/sequelize');
const  DataTypes  = require('sequelize');

const Feedback = sequelize.define('feedback',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },   
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    type : {
        type : DataTypes.STRING,
        isIn : ['EXCELENT', 'GOOD', 'AVERAGE', 'POOR'],
        allowNull: false,
        notEmpty: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true
    }
});

module.exports = Feedback;