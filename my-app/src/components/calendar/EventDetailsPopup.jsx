import React, { useState, useEffect, useRef } from 'react';
import './EventDetailsPopup.css';

const EventDetailsPopup = ({ event, onClose, onEdit, onDelete, onViewParticipants }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  if (!event) return null;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'Fecha no válida';
  };

  const handleMenuOption = (action) => {
    setShowMenu(false);
    if (action === 'edit') onEdit?.(event);
    else if (action === 'delete') onDelete?.(event);
    else if (action === 'participants') onViewParticipants?.(event);
  };

  // 👇 Detectar clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Detalles del Evento</h2>
          <div className="popup-menu-container" ref={menuRef}>
            <button className="menu-btn" onClick={() => setShowMenu(prev => !prev)}>⋮</button>
            {showMenu && (
              <ul className="popup-menu">
                <li onClick={() => handleMenuOption('edit')}>Editar</li>
                <li onClick={() => handleMenuOption('delete')}>Eliminar</li>
                <li onClick={() => handleMenuOption('participants')}>Participantes</li>
              </ul>
            )}
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="popup-content">
          <div className="event-detail">
            <label><strong>Título del Evento:</strong></label>
            <input type="text" value={event.title} readOnly />
          </div>
          <div className="event-detail">
            <label><strong>Ubicación:</strong></label>
            <input type="text" value={event.location} readOnly />
          </div>
          <div className="event-detail">
            <label><strong>Descripción:</strong></label>
            <textarea value={event.description} readOnly />
          </div>
          <div className="event-detail">
            <label><strong>Fecha de Inicio:</strong></label>
            <input type="text" value={formatDate(event.start)} readOnly />
          </div>
          <div className="event-detail">
            <label><strong>Fecha de Fin:</strong></label>
            <input type="text" value={formatDate(event.end)} readOnly />
          </div>
        </div>

        <div className="popup-footer">
          <button className="close-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPopup;
