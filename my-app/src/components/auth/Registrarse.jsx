import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Registrarse.css";
import '../../styles.css';

import Footer from "../layout/Footer.jsx";
import Header from "../layout/HeaderNoSigned.jsx";

export default function Registrarse() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.msg || "Error desconocido al registrarse");
      }
  
      // Guardar token en localStorage
      localStorage.setItem("token", data.token);
  
      // Redirigir a vistaGrupos
      navigate("/vistaGrupos");
  
    } catch (error) {
      alert(`Error al registrarse: ${error.message}`);
      console.error("Registro fallido:", error);
    }
  };
  

  return (
    <div className="display-register">
      <Header />
      <div className="content">
        <div className="register-big-box">
          <div className="register-box">
            <h2>¡Únete a nosotros!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Introduce tu nombre de usuario"
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Introduce tu correo electrónico"
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Introduce tu contraseña"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
              <button type="submit" className="btn-register">Registrarse</button>
            </form>
            <p>
            ¿Ya tienes una cuenta? <Link to="/IniciarSesion">Iniciar sesión
            </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
