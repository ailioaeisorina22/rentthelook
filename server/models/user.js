const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db-config');  // importul conexiunii sequelize

const User = sequelize.define('User', {
    UserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    UserLastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    UserFirstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    UserAge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    Password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    UserGender:{
        type: Sequelize.ENUM("M", "F", "-"),
        allowNull: false
    },
    Phone:{
        type: Sequelize.STRING,
        allowNull: false
    },
    Role:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    tableName:'Users',
    timestamps: true
});

module.exports = User;

