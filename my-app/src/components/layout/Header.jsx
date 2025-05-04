import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();

    const handleMainClick = () => {
        window.location.href = '/';
    };

    const handleUserClick = () => {
        setShowMenu(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername('');
        window.location.href = '/';
    };

    const handleSignupClick = () => {
        window.location.href = '/Registrarse';
    };

    const handleSignInClick = () => {
        window.location.href = '/IniciarSesion';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setUsername('');
            return;
        }

        const fetchUsername = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/my-information', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.name);
                    setIsAuthenticated(true);
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUsername('');
                } else {
                    console.error('Error al obtener la información del usuario');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        fetchUsername();
    }, []);

    // useEffect(() => {
    //     if (location.pathname === '/' && isAuthenticated) {
    //         handleLogout();
    //     }
    // }, [location.pathname, isAuthenticated]);

    return (
        <header className={`header ${isAuthenticated ? 'authenticated' : 'not-authenticated'}`}>
            <div className="logo">
                <button className={`btn main-btn ${isAuthenticated ? 'main-btn-signed' : ''}`} onClick={handleMainClick}>
                    TripCollab
                </button>
            </div>

            {isAuthenticated ? (
                <div className="header-icons">
                    <div className="icon">
                        <i className="fas fa-bell"></i>
                    </div>

                    <div className="icon user-icon" onClick={handleUserClick}>
                        <i className="fas fa-user-circle"></i>
                        {showMenu && (
                            <div className="logout-menu">
                                <button className="logout-button" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="username">
                        <span>{username}</span>
                    </div>
                </div>
            ) : (
                <div className="header-right">
                    <button className="btn header-btn" onClick={handleSignInClick}>Acceder</button>
                    <button className="btn header-btn signup" onClick={handleSignupClick}>Registrarse</button>
                </div>
            )}
        </header>
    );
};

export default Header;
