import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ Registro exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMsg("❌ " + (data.msg || "Error al registrar"));
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setMsg("❌ Error en el servidor");
    }
  };

  return (
    <div className="register-wrapper">
      <Link to="/" className="go-back">← Volver al inicio</Link>

      <div className="register-container">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
        {msg && <p className="register-msg">{msg}</p>}

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
