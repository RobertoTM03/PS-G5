import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailsPopup.css';
import ParticipantsPopup from './ParticipantsPopup';

export default function EventDetailsPopup({ event, onClose, onEdit, onDelete }) {
  const { id: groupId } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const menuRef = useRef(null);

  if (!event) return null;

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = date =>
    date ? new Date(date).toLocaleString() : 'Fecha no válida';

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/groups/${groupId}/activities/${event.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      onDelete(event);
      onClose();
      window.location.reload(); 
    } catch {
      alert('Error al eliminar el evento.');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">{event.title}</h3>
          <div className="popup-menu-container" ref={menuRef}>
            <button
              className="menu-btn"
              onClick={() => setShowMenu(v => !v)}
            >⋮</button>
            {showMenu && (
              <ul className="popup-menu">
                <li onClick={() => { setShowMenu(false); onEdit?.(event); }}>
                  Editar
                </li>
                <li onClick={() => { setShowMenu(false); handleDelete(); }}>
                  Eliminar
                </li>
                <li onClick={() => { setShowMenu(false); setShowParticipants(true); }}>
                  Participantes
                </li>
              </ul>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          <div className="event-detail">
            <input type="text" value={event.location||''} readOnly />
          </div>
          <div className="event-detail">
            <textarea value={event.description||''} readOnly />
          </div>
          <div className="event-detail">
            <input type="text" value={formatDate(event.start)} readOnly />
          </div>
          <div className="event-detail">
            <input type="text" value={formatDate(event.end)} readOnly />
          </div>
        </div>
      </div>

      {showParticipants && (
        <ParticipantsPopup
          event={event}
          onClose={() => setShowParticipants(false)}
          isAdmin={false}
        />
      )}
    </div>
  );
}
