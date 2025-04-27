import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const syncCart = () => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
  };

  const addToCart = (product) => {
    const { _id, selectedColor, selectedSize } = product;

    const existing = cart.find(
      (item) =>
        item._id === _id &&
        item.variant?.color === selectedColor &&
        item.variant?.size === selectedSize
    );

    let updated;

    if (existing) {
      updated = cart.map((item) =>
        item._id === _id &&
        item.variant?.color === selectedColor &&
        item.variant?.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [
        ...cart,
        {
          ...product,
          quantity: 1,
          variant: { color: selectedColor, size: selectedSize },
        },
      ];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };

    window.addEventListener("storage", handleSync);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") handleSync();
    });

    return () => {
      window.removeEventListener("storage", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, syncCart }}>
      {children}
    </CartContext.Provider>
  );
};
