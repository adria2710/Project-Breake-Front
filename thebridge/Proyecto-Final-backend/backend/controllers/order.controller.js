const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const { productos, total } = req.body;

        const newOrder = new Order({
            user: req.user.id,
            productos,
            total,
        });

        await newOrder.save();
        res.status(201).json({ msg: "Pedido guardado", order: newOrder });
    } catch (err) {
        res.status(500).json({ msg: "Error al guardar pedido" });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.json(orders);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

module.exports = {
    createOrder,
    getAllOrders
};