import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // ⚠️ asegúrate de guardar también el usuario si lo usas
      login(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas o error de servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <Link to="/" className="go-back">← Volver al inicio</Link>

      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="register-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
