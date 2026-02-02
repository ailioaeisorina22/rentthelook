const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const Product = require('./product');

const Image = sequelize.define('Image', {
  ImageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'images'
});

Product.hasMany(Image);
Image.belongsTo(Product);

module.exports = Image;