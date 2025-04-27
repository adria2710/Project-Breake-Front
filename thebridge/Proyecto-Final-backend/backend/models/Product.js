const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantSchema = new Schema({
  color: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sizes: { type: [String], default: [] }
});


const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  subcategory: { type: String },
  variants: { type: [variantSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
