import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./ProductList.css";
import { CartContext } from "../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const handleEdit = (id) => {
    window.location.href = `/editar-producto/${id}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert("Producto eliminado ✅");
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <div className="product-list">
      <h2>Todos los productos</h2>
      <div className="product-grid">
        {products.map((product) => {
          const previewImage = product.image || product.variants?.[0]?.image;

          return (
            <div className="product-card" key={product._id}>
              <button onClick={() => addToCart(product)}>Añadir al carrito</button>

              <img
                src={previewImage}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <h4>
                <Link to={`/product/${product._id}`}>{product.title}</Link>
              </h4>
              <p>{product.price} €</p>

              {user?.role === "admin" && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => handleEdit(product._id)}>✏️ Editar</button>
                  <button onClick={() => handleDelete(product._id)}>🗑 Eliminar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
