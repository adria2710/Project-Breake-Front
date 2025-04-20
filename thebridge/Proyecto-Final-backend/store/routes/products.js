// const express = require('express');
// const router = express.Router();
// const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
// router.get('/', getAllProducts);
// router.get('/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
// module.exports = router;

/*GET /           → Todos
GET /:id        → Detalle
POST /          → Crear
PUT /:id        → Editar
DELETE /:id     → Eliminar*/

const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const upload = require('../middlewares/upload.middleware');
router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
//router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
