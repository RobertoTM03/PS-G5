import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ParticipantsPopup.css';

const ParticipantsPopup = ({ event, onClose, isAdmin }) => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);

  // Función para obtener los participantes de la API
  const fetchParticipants = async () => {
    const groupId = id;
    const activityId = event.id;

    if (!groupId || !activityId) {
      console.error('Error: Faltan datos necesarios para obtener los participantes');
      alert('No se pueden obtener los participantes. Faltan datos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/activities/${activityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
        setLoading(false);

        const userId = localStorage.getItem('userId');
        setIsParticipating(data.participants.some(participant => participant.id === userId));
      } else {
        alert('Error al obtener los participantes');
      }
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      alert('Error en la conexión a la API');
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [event]);

  // Función para unirse a la actividad
  const handleJoin = async () => {
    const groupId = id;
    const activityId = event.id;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/activities/${activityId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsParticipating(true);
        fetchParticipants();
      } else {
        alert('Error al unirse a la actividad');
      }
    } catch (error) {
      console.error('Error al unirse:', error);
      alert('Error en la conexión a la API');
    }
  };

  // Función para salir de la actividad
  const handleLeave = async () => {
    const groupId = id;
    const activityId = event.id;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/activities/${activityId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsParticipating(false);
        fetchParticipants();
      } else {
        alert('Error al salir de la actividad');
      }
    } catch (error) {
      console.error('Error al salir:', error);
      alert('Error en la conexión a la API');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    const groupId = id;
    const activityId = event.id;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/activities/${activityId}/participants`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          participantId: participantId,
        }),
      });

      if (response.ok) {
        fetchParticipants();  // Recargar los participantes después de eliminar
      } else {
        alert('Error al eliminar el participante');
      }
    } catch (error) {
      console.error('Error al eliminar el participante:', error);
      alert('Error en la conexión a la API');
    }
  };

  if (loading) {
    return <div>Cargando participantes...</div>;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Participantes del Evento</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          <div className="participants-list">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div key={participant.id} className="participant-item">
                  <p><strong>{participant.name}</strong></p>
                  <p>{participant.email}</p>
                    <button
                      className="remove-participant-btn"
                      onClick={() => handleRemoveParticipant(participant.id)}
                    >
                      ✖
                    </button>
                  
                </div>
              ))
            ) : (
              <p>No hay participantes registrados.</p>
            )}
          </div>
        </div>

        <div className="popup-footer">
          <div className="footer-buttons">
            <button
              onClick={handleJoin}
              className="join-btn"
            >
              Unirse a la actividad
            </button>

            <button
              onClick={handleLeave}
              className="leave-btn"
            >
              Salir de la actividad
            </button>

            <button className="close-btn" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPopup;
