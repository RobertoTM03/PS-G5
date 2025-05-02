import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; 
import './EventDetailsPopup.css';
import ParticipantsPopup from './ParticipantsPopup';

const EventDetailsPopup = ({ event, onClose, onEdit, onDelete, isAdmin }) => {
  const { id } = useParams();  // groupId
  const [showMenu, setShowMenu] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const menuRef = useRef(null);

  if (!event) return null;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'Fecha no válida';
  };

  const handleMenuOption = (action) => {
    setShowMenu(false);
    if (action === 'edit') onEdit?.(event);
    else if (action === 'delete') handleDelete(event);
    else if (action === 'participants') setShowParticipants(true);
  };

  // Función para eliminar el evento llamando a la API
  const handleDelete = async (event) => {
    const groupId = id;  // groupId obtenido de useParams
    const activityId = event.id;   // activityId del evento

    if (!groupId || !activityId) {
      console.error('Error: El evento no tiene un groupId o activityId válido');
      alert('No se puede eliminar el evento. Faltan datos necesarios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }

      // Llama al callback onDelete (si está definido) para actualizar el estado en el componente padre
      onDelete(event); // Actualizar la lista de eventos en el componente padre
      onClose(); // Cierra el popup después de eliminar
      window.location.reload(); // Recargar la página

    } catch (error) {
      console.error('Error al eliminar evento:', error.message || error);
      alert('Hubo un error al eliminar el evento.');
    }
  };

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

      {showParticipants && (
        <ParticipantsPopup 
          event={event}
          onClose={() => setShowParticipants(false)} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default EventDetailsPopup;
