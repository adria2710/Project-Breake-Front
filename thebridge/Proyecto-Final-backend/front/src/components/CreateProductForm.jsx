import { useState } from "react";
import "../styles/CreateProductForm.css";

const subcategoriesByCategory = {
  hombre: ["sudadera", "pantalón", "camiseta"],
  mujer: ["vestido", "falda", "blusa"],
  ninos: ["juguetes", "camiseta", "zapatillas"],
};

const defaultSizes = {
  pantalon: "38,40,42,44",
  default: "S,M,L",
};

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    variants: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subcategory: "" }),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = (index, file) => {
    handleVariantChange(index, "image", file);
  };

  const addVariant = () => {
    const suggestedSizes =
      formData.subcategory.toLowerCase() === "pantalón"
        ? defaultSizes.pantalon
        : defaultSizes.default;

    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { color: "", sizes: suggestedSizes, stock: "", image: null },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("No estás logueado");

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);

    const variants = formData.variants.map((v) => ({
      color: v.color,
      stock: parseInt(v.stock),
      sizes: v.sizes.split(",").map((s) => s.trim()),
    }));
    data.append("variants", JSON.stringify(variants));

    formData.variants.forEach((v) => {
      if (v.image) {
        data.append("images", v.image);
      }
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const contentType = res.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = await res.text();
      }

      if (res.ok) {
        alert("✅ Producto creado con éxito");
      } else {
        console.error("❌ Error al crear producto:", result);
        if (typeof result === "object") {
          alert("❌ Error: " + (result.msg || JSON.stringify(result)));
        } else {
          alert("❌ Error: " + result);
        }
      }
    } catch (err) {
      console.error("❌ Error al crear producto:", err.message, err.stack);
      alert("❌ Error al crear producto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
      <h2>Crear nuevo producto</h2>

      <input type="text" name="title" placeholder="Título" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Descripción" onChange={handleChange} required />
      <input type="number" name="price" step="0.01" min="0" placeholder="Precio" onChange={handleChange} required />

      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">Selecciona una categoría</option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
        <option value="ninos">Niños</option>
      </select>

      {formData.category && (
        <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
          <option value="">Selecciona una subcategoría</option>
          {subcategoriesByCategory[formData.category]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </option>
          ))}
        </select>
      )}

      <hr />
      <h3>Variantes por color</h3>

      {formData.variants.map((variant, index) => (
        <div key={index} className="variant-block">
          <input
            type="text"
            placeholder="Color"
            value={variant.color}
            onChange={(e) => handleVariantChange(index, "color", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tallas"
            value={variant.sizes}
            onChange={(e) => handleVariantChange(index, "sizes", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={variant.stock}
            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(index, e.target.files[0])}
            required
          />
        </div>
      ))}

      <button type="button" onClick={addVariant}>
        ➕ Añadir variante
      </button>

      <button type="submit" style={{ marginTop: "20px" }}>
        Crear producto
      </button>
    </form>
  );
};

export default CreateProductForm;
