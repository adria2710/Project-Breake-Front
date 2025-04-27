import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { cart, clearCart, syncCart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    syncCart();
  }, [location]);

  return (
    <header className="navbar">
      <div className="navbar-logo">
  <Link to="/">MiTienda</Link>
</div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
  <Link to="/">Inicio</Link>

  <div className="dropdown">
    <span className="dropdown-toggle">Hombre</span>
    <div className="dropdown-menu">
      <Link to="/categoria/hombre/sudadera">Sudadera</Link>
      <Link to="/categoria/hombre/pantalón">Pantalón</Link>
      <Link to="/categoria/hombre/camiseta">Camiseta</Link>
    </div>
  </div>

  <div className="dropdown">
    <span className="dropdown-toggle">Mujer</span>
    <div className="dropdown-menu">
      <Link to="/categoria/mujer/vestido">Vestido</Link>
      <Link to="/categoria/mujer/falda">Falda</Link>
      <Link to="/categoria/mujer/blusa">Blusa</Link>
    </div>
  </div>

  <div className="dropdown">
    <span className="dropdown-toggle">Niños</span>
    <div className="dropdown-menu">
      <Link to="/categoria/ninos/juguetes">Juguetes</Link>
      <Link to="/categoria/ninos/camiseta">Camiseta</Link>
      <Link to="/categoria/ninos/zapatillas">Zapatillas</Link>
    </div>
  </div>

  <Link to="/carrito">🛒 ({cart.length})</Link>

  {user ? (
    <>
      <Link to="/dashboard">Dashboard</Link>
      {user.role === "admin" && (
        <>
          <Link to="/crear-producto">Crear producto</Link>
          <Link to="/admin/productos">Gestionar productos</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
        </>
      )}
      <button className="logout-button" onClick={handleLogout}>🔒 Cerrar sesión</button>
    </>
  ) : (
    <Link to="/login">Login</Link>
  )}
</div>


      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </header>
  );
};

export default Navbar;
