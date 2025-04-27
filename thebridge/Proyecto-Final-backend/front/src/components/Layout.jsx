import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>

      <Footer>
  <p>© {new Date().getFullYear()} MiTienda. Todos los derechos reservados.</p>
  <div className="footer-links">
    <a href="#">Términos</a>
    <a href="#">Privacidad</a>
    <a href="#">Contacto</a>
  </div>
</Footer>

    </div>
  );
};

export default Layout;
