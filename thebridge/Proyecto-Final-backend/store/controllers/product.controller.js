// module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
/*    - getAllProducts: Listar todos
    - getProductById: Detalle
    - createProduct: Crear (admin)
    - updateProduct: Editar (admin)
    - deleteProduct: Eliminar (admin) */

const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ msg: 'ID inválido' });
    }
};
const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Parsear strings en arrays si vienen como texto
        productData.sizes = JSON.parse(productData.sizes);
        productData.colors = JSON.parse(productData.colors);

        if (req.file && req.file.path) {
            productData.image = req.file.path;
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Error al crear producto:", err); // 👈 esto es clave
        res.status(500).json({ msg: 'Error al crear producto' });
    }
};
/*const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (req.file && req.file.path) {
            productData.image = req.file.path; 
        }
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear producto' });
    }
};*/

/*
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear producto' });
    }
};*/

const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ msg: 'Error al actualizar producto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (err) {
        res.status(400).json({ msg: 'Error al eliminar producto' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };