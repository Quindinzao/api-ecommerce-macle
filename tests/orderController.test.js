const request = require('supertest');
const app = require('../src/app'); // ajuste o caminho se necessário
const { Order, OrderItem, Product, User } = require('../src/models');

jest.mock('../src/models');

describe('Order Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('deve criar um pedido com sucesso', async () => {
      const mockProduct = { 
        id: 1, 
        price: 100, 
        name: 'Produto Teste', 
        description: "Description Produto Teste" 
      };
      Product.findByPk.mockResolvedValue(mockProduct);

      Order.create.mockResolvedValue({ id: 1 });
      OrderItem.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/orders/1')
        .send({
          items: [{ productId: 1, quantity: 2 }],
          address: 'Rua Teste',
          status: 'pendente',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: 'Pedido criado com sucesso.',
        orderId: 1,
      });
    });

    it('deve retornar erro 400 se não houver itens', async () => {
      const response = await request(app)
        .post('/api/orders/1')
        .send({ items: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Itens do pedido são obrigatórios.');
    });

    it('deve retornar erro 404 se produto não for encontrado', async () => {
      Product.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/orders/1')
        .send({
          items: [{ productId: 999, quantity: 1 }],
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Produto com ID 999 não encontrado.');
    });

    it('deve retornar erro 500 se houver erro interno', async () => {
      Product.findByPk.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/api/orders/1')
        .send({
          items: [{ productId: 1, quantity: 1 }],
        });

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Erro ao criar pedido.');
    });
  });

  describe('getOrdersByStatus', () => {
    it('deve retornar lista de pedidos por status', async () => {
      Order.findAll.mockResolvedValue([
        {
          id: 1,
          status: 'pendente',
          OrderItems: [],
          User: { id: 1, username: 'user1' },
        },
      ]);

      const response = await request(app).get('/api/orders/by-status?status=pendente');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].status).toBe('pendente');
    });

    it('deve retornar erro 500 se falhar ao buscar pedidos', async () => {
      Order.findAll.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/api/orders/by-status?status=pendente');

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar pedidos.');
    });
  });

  describe('getOrdersByUserId', () => {
    it('deve retornar pedidos de um usuário', async () => {
      Order.findAll.mockResolvedValue([
        {
          id: 1,
          status: 'entregue',
          OrderItems: [],
          User: { id: 1, username: 'user1' },
        },
      ]);

      const response = await request(app).get('/api/orders/user/1?status=entregue');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].User.username).toBe('user1');
    });

    it('deve retornar erro 500 se falhar ao buscar por usuário', async () => {
      Order.findAll.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/orders/user/1?status=entregue');

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar pedidos.');
    });
  });

  describe('updateOrder', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: { id: '1' },
        body: { status: 'enviado' }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('deve atualizar o pedido com sucesso', async () => {
      const mockOrder = {
        update: jest.fn().mockResolvedValue(),
      };

      Order.findByPk.mockResolvedValue(mockOrder);

      const { updateOrder } = require('../src/controllers/orderController');
      await updateOrder(req, res);

      expect(Order.findByPk).toHaveBeenCalledWith('1');
      expect(mockOrder.update).toHaveBeenCalledWith({ status: 'enviado' });
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('deve retornar erro 400 se pedido não for encontrado', async () => {
      Order.findByPk.mockResolvedValue(null);

      const { updateOrder } = require('../src/controllers/orderController');
      await updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado' });
    });

    it('deve retornar erro 500 se ocorrer falha', async () => {
      Order.findByPk.mockRejectedValue(new Error('DB error'));

      const { updateOrder } = require('../src/controllers/orderController');
      await updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar produto' });
    });
  });
});