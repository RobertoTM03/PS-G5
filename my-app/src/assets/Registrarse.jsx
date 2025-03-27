import React, { useState } from "react";
import "./Registrarse.css";
import Footer from "./Footer";
import { Link, useNavigate } from 'react-router-dom';
import Header from "./HeaderNoSigned";
import VistaGrupos from "./vistaGrupos";

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
    <div className="main-container">
      <Header />
      <div className="content">
        <div className="registro-container">
          <div className="registro-box">
            <h2>Join us!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat the password"
                  required
                />
              </div>
              <button type="submit" className="btn-register">Sign Up</button>
            </form>
            <p>
              Already have an account? <Link to="/IniciarSesion">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
