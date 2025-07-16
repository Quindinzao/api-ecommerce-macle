const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  price: DataTypes.FLOAT,
  description: DataTypes.TEXT
});

module.exports = Product;