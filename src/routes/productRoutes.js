const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', auth, productController.getAllProducts);
router.get('/product/:id', auth, productController.getProductById);
router.post('/', auth, isAdmin, productController.createProduct);
router.put('/product/:id', auth, isAdmin, productController.updateProduct);
router.delete('/product/:id', auth, isAdmin, productController.removeProduct);

module.exports = router;