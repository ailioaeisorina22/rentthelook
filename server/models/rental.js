const { DataTypes } = require('sequelize');
const sequelize = require('../db-config');
const User = require("./user");

const Rental = sequelize.define('Rental', {
  RentalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  TotalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  StripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  tableName: 'rentals',
  timestamps: false
});


User.hasMany(Rental, { foreignKey: 'UserId' });
Rental.belongsTo(User, { foreignKey: 'UserId' });

module.exports = Rental;