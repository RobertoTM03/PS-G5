import React, { useState } from "react";
import "./Registrarse.css";
import Footer from "./Footer";
import { Link } from 'react-router-dom';

export default function Registrarse() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Registro exitoso:", formData);
  };

  return (
    <div className="main-container"> {/* Nuevo contenedor que usa flexbox */}
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
      <Footer /> {/* Footer pegado abajo */}
    </div>
  );
}
