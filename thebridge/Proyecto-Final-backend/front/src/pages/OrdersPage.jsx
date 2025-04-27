
import { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este pedido?");
    if (!confirm) return;

    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:4000/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
        console.error("Error al eliminar pedido:", err);
    }
};
    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:4000/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Error cargando pedidos:", err));
    }, []);

    return (
        <div>
            <h2>Pedidos recibidos</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order._id} style={{ marginBottom: "20px" }}>
                        <p><strong>Pedido:</strong> {order._id}</p>
                        <p><strong>Usuario:</strong> {order.user?.email}</p>
                        <p><strong>Productos:</strong></p>
                        <ul>
                            {order.productos.map((p, i) => (
                                <li key={i}>
                                    {p.title} - {p.price}€ x {p.quantity}
                                </li>
                            ))}
                        </ul>
                        <p><strong>Total:</strong> {order.total}€</p>
                        <p><strong>Fecha:</strong> {new Date(order.fecha).toLocaleString()}</p>
                        <button onClick={() => handleDelete(order._id)}>🗑 Eliminar</button>

                        <hr />
                    </li>
                ))}
            </ul>

        </div>
    );
};



export default OrdersPage;
