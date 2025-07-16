const Order = require('../models/Order');

exports.checkout = async (req, res) => {
  const { items, paymentMethod, address } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Carrinho está vazio ou inválido' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const order = await Order.create({
      UserId: req.userId,
      total,
      paymentMethod,
      address
    });

    res.status(201).json({ message: 'Pedido finalizado com sucesso', order });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao finalizar pedido' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { UserId: req.userId } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};