const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');

router.use(auth);

router.post('/checkout', orderController.checkout);
router.get('/', orderController.getOrders);

module.exports = router;