const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const User = require("./user");

const Cart = sequelize.define('Cart', {
  CartId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Status: {
    type:DataTypes.ENUM("active", "inactive"),
    allowNull: false
  },
  TotalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'carts',
  timestamps: false
});


User.hasMany(Cart, { foreignKey: 'UserId' });
Cart.belongsTo(User, { foreignKey: 'UserId' });

module.exports = Cart;