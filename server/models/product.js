const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');

const Product = sequelize.define('Product', {
  ProductId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Desription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  PricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Category: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  Subcategory: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  Quality: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  Deposit: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  tableName: 'products'
});

module.exports = Product;
