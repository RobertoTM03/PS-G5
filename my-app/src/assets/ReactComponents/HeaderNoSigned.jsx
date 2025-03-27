import React from 'react'
import "../CSS/HeaderNoSigned.css";

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
            <h2 className="logo">TripCollab</h2>
            <button className="btn main-btn" onClick={handleMainClick}>MAIN</button>
          </div>
          <div className="header-right">
            <button className="btn header-btn" onClick={handleSignInClick}>Login</button>
            <button className="btn header-btn signup" onClick={handleSignupClick}>Sign Up</button>
          </div>
        </header>
      </div>
    );
  }
  
