import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error cargando productos:", err));
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("¿Eliminar este producto?");
        if (!confirm) return;

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
                alert("Producto eliminado");
            } else {
                alert("Error al eliminar producto");
            }
        } catch (err) {
            console.error(err);
            alert("Error del servidor");
        }
    };

    return (
        <div>
            <h2>Gestión de productos</h2>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <strong>{product.title}</strong> — {product.price}€
                        {" | "}
                        <Link to={`/editar-producto/${product._id}`}>Editar</Link>
                        {" | "}
                        <button onClick={() => handleDelete(product._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProducts;
