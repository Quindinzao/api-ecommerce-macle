const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/user/:userId', auth, orderController.createOrder);
router.put('/order/:id', auth, orderController.updateOrder);
router.get('/user/:userId', auth, orderController.getOrdersByUserId);
router.get('/by-status', auth, isAdmin, orderController.getOrdersByStatus);

module.exports = router;