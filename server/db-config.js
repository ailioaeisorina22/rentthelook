const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'rentthelook',
    username: 'root',
    password: 'root',
    host: '127.0.0.1'
});

module.exports = sequelize;