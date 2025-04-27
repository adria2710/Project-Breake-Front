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

    console.log("🟡 Body recibido:", productData);
    console.log("🟢 Archivos recibidos:", req.files);


    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No se subieron imágenes" });
    }

    if (req.files.length !== productData.variants.length) {
      return res.status(400).json({ msg: "Número de imágenes no coincide con variantes" });
    }


    productData.variants = productData.variants.map((variant, index) => {
      if (typeof variant.sizes === "string") {
        variant.sizes = variant.sizes.split(",").map(s => s.trim());
      }

      return {
        ...variant,
        image: req.files[index]?.path,
        stock: Number(variant.stock) || 0,
      };
    });


    for (const variant of productData.variants) {
      if (!variant.color || !variant.image || !variant.sizes.length) {
        return res.status(400).json({ msg: "Falta color, imagen o tallas en alguna variante" });
      }
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error al crear producto:", err.message);
    console.error("📦 req.body:", JSON.stringify(req.body, null, 2));
    console.error("📂 req.files:", req.files);
    console.error("🔍 Stack:", err.stack);
    res.status(500).json({ msg: "Error al crear producto", error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    if (req.files && req.files.length > 0 && productData.variants?.length) {
      productData.variants = productData.variants.map((variant, index) => ({
        ...variant,
        image: req.files[index]?.path || variant.image,
      }));
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ msg: "Producto no encontrado" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err.message);
    console.error("🧠 Stack trace:", err.stack);
    res.status(400).json({ msg: "Error al actualizar producto" });
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

const getProductsByCategory = async (req, res) => {
  try {
    const { tipo } = req.params;
    const products = await Product.find({ category: new RegExp(`^${tipo}$`, "i") });
    res.json(products);
  } catch (err) {
    console.error("❌ Error obteniendo productos por categoría:", err.message);
    console.error("🧠 Stack trace:", err.stack);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
