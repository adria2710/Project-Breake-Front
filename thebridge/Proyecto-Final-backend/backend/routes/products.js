
const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/product.controller');

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/categoria/:tipo', getProductsByCategory);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', verifyToken, isAdmin, upload.array('images'), createProduct);
router.put('/:id', verifyToken, isAdmin, upload.array('images'), updateProduct);

router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
