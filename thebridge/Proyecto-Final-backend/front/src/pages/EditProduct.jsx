import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductForm.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    variants: [],
  });
  const [loading, setLoading] = useState(true);

  const subcategoriesByCategory = {
    hombre: ["sudadera", "pantalón", "camiseta"],
    mujer: ["vestido", "falda", "blusa"],
    ninos: ["juguetes", "camiseta", "zapatillas"],
  };

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const transformedVariants = data.variants.map((v) => ({
          ...v,
          sizes: v.sizes?.join(",") || "",
          image: null 
        }));
        setFormData({ ...data, variants: transformedVariants });
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

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
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", sizes: "", stock: "", image: null }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("No autorizado");

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
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("Producto actualizado ✅");
        navigate("/admin/productos");
      } else {
        alert("Error: " + result.msg);
      }
    } catch (err) {
      console.error("Error al actualizar producto", err);
      alert("Error al actualizar producto");
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
      <h2>Editar producto</h2>

      <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} required />
      <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required />

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
            placeholder="Tallas (S,M,L)"
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
          />
        </div>
      ))}

      <button type="button" onClick={addVariant}>
        ➕ Añadir variante
      </button>

      <button type="submit" style={{ marginTop: "20px" }}>
        Guardar cambios
      </button>
    </form>
  );
};

export default EditProduct;
