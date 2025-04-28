import React, { useEffect, useState } from 'react';
import './HeaderSigned.css';

const Header = () => {
  const [username, setUsername] = useState('');
  const [showMenu, setShowMenu]   = useState(false);

  const handleMainClick = () => {
    window.location.href = '/';
  };

  const handleUserClick = () => {
    setShowMenu(prev => !prev);
  };

  const handleLogout = () => {
    // 1) eliminamos el token (o lo que uses) del localStorage
    localStorage.removeItem('token');
    // 2) redirigimos a la página de inicio
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/auth/my-information', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.name);
        } else {
          console.error('Error al obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };
    fetchUsername();
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <button className="btn main-btn-signed" onClick={handleMainClick}>
          TripCollab
        </button>
      </div>

      <div className="header-icons">
        <div className="icon">
          <i className="fas fa-bell"></i>
        </div>

        <div className="icon user-icon" onClick={handleUserClick}>
          <i className="fas fa-user-circle"></i>
          {showMenu && (
            <div className="logout-menu">
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <div className="username">
          <span>{username}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
