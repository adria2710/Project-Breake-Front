
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} MiTienda. Todos los derechos reservados.</p>
        <div className="footer-links">
          <Link to="/terminos">Términos</Link>
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
