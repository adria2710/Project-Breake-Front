
const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createOrder);

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Pedido eliminado' });
    } catch (err) {
        console.error('Error eliminando pedido:', err);
        res.status(500).json({ msg: 'Error al eliminar el pedido' });
    }
});

router.get('/', verifyToken, isAdmin, getAllOrders);

module.exports = router;
