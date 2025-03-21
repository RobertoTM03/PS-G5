import React from "react";
import "./Inicio.css";
import Footer from "./Footer";
import mundo from "../pictures/mundo.png";

export default function Inicio() {
    const handleSignupClick = () => {
        window.location.href = "./Registrarse";
    };

    return (
        <div className="inicio">
            <div className="container">
                <div className="left-section">
                    <h1>¡Viajar en grupo nunca ha sido tan fácil!</h1>
                    <p>
                        Facilita la colaboración en equipo con herramientas para organizar
                        grupos, dividir gastos, gestionar eventos, compartir documentos y
                        comunicarte en tiempo real.
                    </p>
                    <p>Todo lo que necesitas para trabajar en equipo, en una sola aplicación.</p>

                    <button className="btn login-btn">Login</button>
                    <button className="btn signup-btn" onClick={handleSignupClick}>
                        Sign Up
                    </button>
                </div>

                <div className="right-section">
                    <div className="image-placeholder">
                        <img src={mundo} alt="mundo" className="mundo-image" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
