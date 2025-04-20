const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    sizes: { type: [String], enum: ['XS', 'S', 'M', 'L', 'XL'] },  // tallas permitidas
    colors: { type: [String], required: true },                    // al menos un color
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
