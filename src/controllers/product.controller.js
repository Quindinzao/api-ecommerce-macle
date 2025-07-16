const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10, sort = 'name', order = 'ASC', filter } = req.query;
  const offset = (page - 1) * limit;

  const where = filter ? {
    name: { [Op.like]: `%${filter}%` }
  } : {};

  try {
    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order]],
    });

    res.json({
      data: products.rows,
      total: products.count,
      page: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.update(req.body, { where: { id } });
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
};