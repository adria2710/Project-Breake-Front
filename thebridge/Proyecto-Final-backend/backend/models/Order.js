const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productos: [
        {
            _id: String,
            title: String,
            price: Number,
            quantity: Number,
        }
    ],
    total: Number,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
