const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  total: DataTypes.FLOAT,
  paymentMethod: DataTypes.STRING,
  address: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;