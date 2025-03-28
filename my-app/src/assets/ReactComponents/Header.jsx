import React from 'react';
import '../CSS/HeaderSigned.css';  

const Header = () => {
    const username = localStorage.getItem("username"); 

    return (
        <header className="header">
            <div className="logo">
                <h1>TripCollab</h1>
            </div>
            <div className="header-icons">
                <div className="icon">
                    <i className="fas fa-bell"></i>
                </div>
                <div className="icon">
                    <i className="fas fa-user-circle"></i>
                </div>
                <div className="username">
                    <span>{username ? username : "Guest"}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;