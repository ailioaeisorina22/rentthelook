const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const User = require('./user');
const ProductSize = require('./productsizes');

const Feedback = sequelize.define('Feedback', {
    FeedbackId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SizeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    FeedbackDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
     timestamps: true 
});

Feedback.belongsTo(User, {foreignKey: 'UserId'});
User.hasMany(Feedback, {foreignKey: 'UserId'});

Feedback.belongsTo(ProductSize, {foreignKey:'SizeId'});
ProductSize.hasMany(Feedback, {foreignKey: 'SizeId'});


module.exports = Feedback;