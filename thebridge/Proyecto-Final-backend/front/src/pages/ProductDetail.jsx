import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/ProductDetail.css";

const colorMap = {
  rojo: "#e60026",
  negro: "#000000",
  blanco: "#ffffff",
  azul: "#0055ff",
  verde: "#009933",
  gris: "#cccccc",
  beige: "#f5f5dc",
  marrón: "#8B4513",
  amarillo: "#ffff00",
  rosa: "#ff0080",
  naranja: "#ff8000",
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
          setSelectedSize(data.variants[0].sizes?.[0] || "");
        }
      })
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  const handleColorSelect = (color) => {
    const variant = product.variants.find((v) => v.color === color);
    if (variant) {
      setSelectedVariant(variant);
      setSelectedSize(variant.sizes?.[0] || "");
    }
  };

  if (!product || !selectedVariant) return <p>Cargando producto...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={selectedVariant.image} alt={product.title} />

        <div className="color-selector">
          {product.variants.map((variant) => (
            <div
              key={variant.color}
              className={`color-circle ${selectedVariant.color === variant.color ? "selected" : ""}`}
              style={{
                backgroundColor: colorMap[variant.color.toLowerCase()] || "#ccc",
              }}
              onClick={() => handleColorSelect(variant.color)}
              title={variant.color}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2>{product.title}</h2>
        <p className="price">{product.price?.toFixed(2)} €</p>
        <p>{product.description}</p>

        {selectedVariant.sizes?.length > 0 && (
          <div className="option">
            <label><strong>Talla:</strong></label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              {selectedVariant.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        <p><strong>Color:</strong> <span className="color-name">{selectedVariant.color}</span></p>
        <p><strong>Categoría:</strong> {product.category}</p>
        <p><strong>Stock:</strong> {selectedVariant.stock}</p>

        <button
          className="add-to-cart"
          onClick={() =>
            addToCart({
              _id: product._id,
              title: product.title,
              price: product.price,
              image: selectedVariant.image,
              variant: {
                color: selectedVariant.color,
                size: selectedSize,
              },
              quantity: 1,
            })
          }
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
