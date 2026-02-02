// models/shippingdetails.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db-config");
const Rental = require("./rental");

const ShippingDetails = sequelize.define("ShippingDetails", {
  ShippingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RentalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  FirstName: DataTypes.STRING,
  LastName: DataTypes.STRING,
  Email: DataTypes.STRING,
  Phone: DataTypes.STRING,
  Street: DataTypes.STRING,
  Block: DataTypes.STRING,
  City: DataTypes.STRING,
  PostalCode: DataTypes.STRING
}, {
  tableName: "shippingdetails",
  timestamps: false
});

Rental.hasOne(ShippingDetails, { foreignKey: "RentalId" });
ShippingDetails.belongsTo(Rental, { foreignKey: "RentalId" });

module.exports = ShippingDetails;
