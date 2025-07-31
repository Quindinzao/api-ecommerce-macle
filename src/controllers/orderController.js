const { Order, OrderItem, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, address, paymentMethod, status } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Itens do pedido são obrigatórios.' });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      userId,
      address: address || null,
      status,
      totalPrice,
      paymentMethod
    });

    for (const item of orderItemsData) {
      await OrderItem.create({
        orderId: order.id,
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
      });
    }

    return res.status(201).json({ message: 'Pedido criado com sucesso.', orderId: order.id });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ message: 'Erro ao criar pedido.' });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    const orders = await Order.findAll({
      where: { status },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'image', 'description']
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'username'] 
        }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos por status:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos.' });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  try {
    const orders = await Order.findAll({
      where: { userId, status },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'image', 'description']
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'username'] 
        }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos pelo id do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos.' });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(400).json({ error: 'Pedido não encontrado' });

    await order.update({status});
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};
