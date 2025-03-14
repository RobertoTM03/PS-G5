import React from 'react';
import './Inicio.css';

export default function Inicio() {
    return (
        <div className="container">
            {/* Sección Izquierda */}
            <div className="left-section">
                <h1>Lorem ipsum!</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="btn login-btn">Login</button>
                <button className="btn signup-btn">Sign Up</button>
            </div>

            {/* Sección Derecha - Imagen o componente de información */}
            <div className="right-section">
                <div className="image-placeholder">
                    <p>Información o imagen aquí</p>
                </div>
            </div>
        </div>
    );
}
