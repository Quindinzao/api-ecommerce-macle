const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/:userId', auth, orderController.createOrder);
router.put('/:id', auth, orderController.updateOrder);
router.get('/:userId', auth, orderController.getOrdersByUserId);
router.get('/', auth, isAdmin, orderController.getOrdersByStatus);

module.exports = router;