const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const Cart = require("./cart");
const ProductSize = require('./productsizes');

const CartItem = sequelize.define('CartItem', {
  CartItemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CartId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ItemPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'cartitems',
  timestamps: false
});

Cart.hasMany(CartItem, {foreignKey: 'CartId'});
CartItem.belongsTo(Cart, {foreignKey: 'CartId'});

ProductSize.hasMany(CartItem, { foreignKey: 'SizeId' });
CartItem.belongsTo(ProductSize, { foreignKey: 'SizeId' });

module.exports = CartItem;
