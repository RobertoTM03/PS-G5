import React from 'react';
import '../CSS/HeaderSigned.css';  // Estilo adicional que crearemos a continuación

const Header = () => {
    // Obtener el nombre de usuario desde el localStorage
    const username = localStorage.getItem("username");  // Asegúrate de tener el nombre de usuario almacenado

    return (
        <header className="header">
            <div className="logo">
                <h1>TripCollab</h1>
            </div>
            <div className="header-icons">
                {/* Icono de campana */}
                <div className="icon">
                    <i className="fas fa-bell"></i>
                </div>
                {/* Icono de foto de usuario */}
                <div className="icon">
                    <i className="fas fa-user-circle"></i>
                </div>
                {/* Nombre de usuario */}
                <div className="username">
                    <span>{username ? username : "Guest"}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;