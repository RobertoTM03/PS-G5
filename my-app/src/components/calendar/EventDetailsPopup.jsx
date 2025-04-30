import React from 'react';
import './EventDetailsPopup.css'; // Importa el CSS correspondiente

const EventDetailsPopup = ({ event, onClose }) => {
  if (!event) return null; // Si no hay evento, no renderizamos nada

  // Aseguramos que las fechas se conviertan correctamente si están en formato ISO
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'Fecha no válida';
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Detalles del Evento</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          <div className="event-detail">
            <label htmlFor="title"><strong>Título del Evento:</strong></label>
            <input 
              id="title"
              type="text" 
              value={event.title} 
              readOnly
            />
          </div>
          <div className="event-detail">
            <label htmlFor="location"><strong>Ubicación:</strong></label>
            <input 
              id="location"
              type="text" 
              value={event.location} 
              readOnly
            />
          </div>
          <div className="event-detail">
            <label htmlFor="description"><strong>Descripción:</strong></label>
            <textarea 
              id="description"
              value={event.description} 
              readOnly
            />
          </div>
          <div className="event-detail">
            <label htmlFor="start"><strong>Fecha de Inicio:</strong></label>
            <input 
              id="start"
              type="text" 
              value={formatDate(event.start)} 
              readOnly
            />
          </div>
          <div className="event-detail">
            <label htmlFor="end"><strong>Fecha de Fin:</strong></label>
            <input 
              id="end"
              type="text" 
              value={formatDate(event.end)} 
              readOnly
            />
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
