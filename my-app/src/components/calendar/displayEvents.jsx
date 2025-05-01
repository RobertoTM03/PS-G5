import React from 'react';
import './displayEvents.css';

export default function DisplayEvents({ date, events, onClose, onCreate }) {
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  });

  const formatDateTime = iso =>
    new Date(iso).toLocaleString('es-ES', {
      day:   '2-digit',
      month: '2-digit',
      year:  'numeric',
      hour:  '2-digit',
      minute:'2-digit'
    });

  return (
    <div className="de-backdrop" onClick={onClose}>
      <div className="de-modal" onClick={e => e.stopPropagation()}>
        <button className="de-close" onClick={onClose}>×</button>
        <h3>Eventos de {formattedDate}</h3>
        <div className="de-events-list">
          {events.length > 0 ? (
            events.map(ev => (
              <div key={ev.id} className="de-event-item">
                <h4 className="de-event-title">{ev.title}</h4>
                {ev.description && <p className="de-event-desc">{ev.description}</p>}
                <p className="de-event-time">{formatDateTime(ev.start)} – {formatDateTime(ev.end)}</p>
              </div>
            ))
          ) : (
            <p className="de-no-events">No hay eventos para este día.</p>
          )}
        </div>
        <button className="de-create-btn" onClick={() => onCreate(date)}>
          Crear evento
        </button>
      </div>
    </div>
  );
}
