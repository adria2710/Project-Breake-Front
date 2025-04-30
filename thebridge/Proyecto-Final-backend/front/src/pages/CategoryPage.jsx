import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../components/ProductList.css";

const CategoryPage = ({ mostrarTodo = false }) => {
  const { categoria, subcategoria } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const subcategoriesByCategory = {
    hombre: ["sudadera", "pantalón", "camiseta"],
    mujer: ["vestido", "falda", "blusa"],
    ninos: ["juguetes", "camiseta", "zapatillas"],
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const filtrados = mostrarTodo
          ? data
          : data.filter((p) => {
              const matchCategory = p.category?.toLowerCase() === categoria?.toLowerCase();
              const matchSub = !subcategoria || p.subcategory?.toLowerCase() === subcategoria?.toLowerCase();
              return matchCategory && matchSub;
            });
        setProducts(filtrados);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, [categoria, subcategoria, mostrarTodo]);

  const handleEdit = (id) => {
    window.location.href = `/editar-producto/${id}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/products/${id}`, {
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

  const capitalizar = (texto) =>
    texto?.charAt(0).toUpperCase() + texto?.slice(1);

  return (
    <div className="product-list">
      <h2>
        {mostrarTodo
          ? "Todos los productos"
          : `Categoría: ${capitalizar(categoria)}${subcategoria ? ` → ${capitalizar(subcategoria)}` : ""}`}
      </h2>

      {!mostrarTodo && subcategoriesByCategory[categoria] && (
        <div className="subcategory-buttons">
          <button
            onClick={() => navigate(`/categoria/${categoria}`)}
            className={!subcategoria ? "active" : ""}
          >
            Todas
          </button>
          {subcategoriesByCategory[categoria].map((sub) => (
            <button
              key={sub}
              onClick={() => navigate(`/categoria/${categoria}/${sub}`)}
              className={subcategoria === sub ? "active" : ""}
            >
              {capitalizar(sub)}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => {
            const previewImage = product.image || product.variants?.[0]?.image;

            return (
              <div className="product-card" key={product._id}>
                <button onClick={() => addToCart(product)}>Añadir al carrito</button>

                <Link to={`/product/${product._id}`}>
                  <img src={previewImage} alt={product.title} />
                </Link>

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
          })
        ) : (
          <p>No hay productos en esta categoría o subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
