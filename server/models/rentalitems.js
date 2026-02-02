const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const User = require('./user');
const ProductSize = require('./productsizes');
const Rental = require('./rental');

const RentalItems = sequelize.define('RentalItems', {
  RentalItemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  StartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  EndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('confirmata', 'plasata','returnata','incheiata','la-client'),
    allowNull: false,
    defaultValue: 'confirmata'
  },
  Price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'rentalitems',
  timestamps: false
});

ProductSize.hasMany(RentalItems, { foreignKey: 'SizeId' });
RentalItems.belongsTo(ProductSize, { foreignKey: 'SizeId' });

Rental.hasMany(RentalItems, {foreignKey: 'RentalId'});
RentalItems.belongsTo(Rental, {foreignKey: 'RentalId'});

module.exports = RentalItems;
