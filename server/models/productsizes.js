const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const Product = require('./product');

const ProductSizes = sequelize.define('ProductSizes', {
  SizeId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'ProductId'
    }
  },
  Size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'productsizes'
});

Product.hasMany(ProductSizes, { foreignKey: 'ProductId' });
ProductSizes.belongsTo(Product, { foreignKey: 'ProductId' });

module.exports = ProductSizes;
