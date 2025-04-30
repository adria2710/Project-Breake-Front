import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (itemToUpdate) => {
    const updatedCart = cart.map((item) =>
      item._id === itemToUpdate._id &&
      item.variant?.color === itemToUpdate.variant?.color &&
      item.variant?.size === itemToUpdate.variant?.size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemToUpdate) => {
    const updatedCart = cart
      .map((item) =>
        item._id === itemToUpdate._id &&
        item.variant?.color === itemToUpdate.variant?.color &&
        item.variant?.size === itemToUpdate.variant?.size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (itemToRemove) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item._id === itemToRemove._id &&
          item.variant?.color === itemToRemove.variant?.color &&
          item.variant?.size === itemToRemove.variant?.size
        )
    );
    updateCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const checkout = async () => {
    if (cart.length === 0) return alert("Tu carrito está vacío");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productos: cart, total }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        alert("¡Pedido realizado con éxito! 🎉");
        console.log("🧾 Pedido guardado:", data.order);
      } else {
        alert(data.msg || "Error al guardar el pedido");
      }
    } catch (err) {
      console.error("Error al hacer el pedido:", err);
      alert("Error del servidor");
    }
  };

  return (
    <div className="cart-container">
      <h2>🛒 Tu carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <p><strong>{item.title}</strong></p>
              <p>Precio: {item.price} €</p>
              {item.variant && (
                <p>
                  <span>Color: {item.variant.color}</span> |{" "}
                  <span>Talla: {item.variant.size}</span>
                </p>
              )}
              <div className="cart-controls">
                <button onClick={() => decreaseQuantity(item)}>➖</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item)}>➕</button>
                <button onClick={() => removeItem(item)}>❌</button>
              </div>
            </div>
          ))}

          <h4 className="cart-total">Total: {total.toFixed(2)} €</h4>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-btn">Vaciar carrito 🗑</button>
            <button onClick={checkout} className="checkout-btn">Finalizar compra ✅</button>
          </div>
          <Link to="/" className="back-button">← Volver a la tienda</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
