const sequelize = require('../database/sequelize');
const  DataTypes  = require('sequelize');

const Activity = sequelize.define('activity',{
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
    code : {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true
    }
});

module.exports = Activity;