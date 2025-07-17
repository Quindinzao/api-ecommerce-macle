const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.findAll();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(400).json({ error: 'Produto não encontrado' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
};

exports.createProduct = async (req, res) => {
  const { name, image, price, description } = req.body;
  try {
    const product = await Product.create({ name, image, price, description });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price, description } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(400).json({ error: 'Produto não encontrado' });

    await product.update({name, image, price, description });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(400).json({ error: 'Produto não encontrado' });

    await product.destroy();
    res.status(200).json({ message: 'Produto removido com sucesso' })
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover produto' });
  }
}
