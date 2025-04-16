import React from 'react'
import "./HeaderNoSigned.css";

export default function HeaderNoSigned() {
    const handleSignupClick = () => {
        window.location.href = "./Registrarse";
    };
    const handleSignInClick = () => {
        window.location.href = "./IniciarSesion";
    };
    const handleMainClick = () => {
        window.location.href = "./";
    };

    return (
      <div>
        <header className="main-header">
          <div className="header-left">
          <button className="btn main-btn" onClick={handleMainClick}>TripCollab</button>
          </div>
          <div className="header-right">
            <button className="btn header-btn" onClick={handleSignInClick}>Acceder</button>
            <button className="btn header-btn signup" onClick={handleSignupClick}>Registrarse</button>
          </div>
        </header>
      </div>
    );
  }
  
