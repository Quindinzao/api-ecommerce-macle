const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      products,
      total: count,
      hasMore: offset + limit < count,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(400).json({ error: 'Produto não encontrado' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, image, price, description } = req.body;
  try {
    let imageData = null;
    if (image && typeof image === 'string' && image.startsWith('data:')) {
      imageData = image.split(',')[1];
    }

    const product = await Product.create({ name, image: imageData, price, description });
    res.status(200).json(product);
  } catch (err) {
    console.log({err})
    res.status(400).json({ error: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price, description } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(400).json({ error: 'Produto não encontrado' });

    let imageData = null;
    if (image && typeof image === 'string' && image.startsWith('data:')) {
      imageData = image.split(',')[1];
    }

    await product.update({ 
      name, 
      image: imageData !== null ? imageData : product.image, 
      price, 
      description 
    });
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
    res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover produto' });
  }
};