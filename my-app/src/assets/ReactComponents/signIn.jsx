import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/signIn.css';
import Footer from './Footer.jsx';
import Header from './HeaderNoSigned.jsx';

export default function IniciarSesion() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    identifier: formData.identifier,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error desconocido al iniciar sesión");
            }

            localStorage.setItem("token", data.token);

            navigate("/vistaGrupos");
        } catch (error) {
            alert(`Error al iniciar sesión: ${error.message}`);
            console.error("Inicio de sesión fallido:", error);
        }
    };

    return (
        <main className="sign-page-container">
            <Header />
            <div className="content">
                <section className="sign-box">
                    <div className="title-text">
                        <h1>Bienvenido</h1>
                    </div>
                    <section className="sign-entry-form">
                        <form id="loginFormUser" onSubmit={handleSubmit}>
                            <label htmlFor="identifier">Usuario o correo electrónico
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                required
                                placeholder="Introduce tu usuario o correo"
                                value={formData.identifier}
                                onChange={handleChange}
                            />

                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Introduce tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button type="submit" className="submit-button">Iniciar sesión</button>
                        </form>
                    </section>

                    <div className="bottom-text">
                        <p>
                        ¿No tienes cuenta? <Link to="/Registrarse">Regístrate</Link>
                        </p>
                        <p>
                            <Link to="/PasswordRecovery">¿Olvidaste tu contraseña?</Link>
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
