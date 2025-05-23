import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ParticipantsPopup.css';

const ParticipantsPopup = ({ event, onClose, isAdmin, isCreator, createdBy }) => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [userId, setUserId] = useState(null);
  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/my-information', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setUserId(userDetails.id);
      } else {
        console.error('Error fetching user details');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };
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

        if (userId) {
          setIsParticipating(data.participants.some(participant => participant.id === userId));
        }
      } else {
        alert('Error al obtener los participantes');
      }
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      alert('Error en la conexión a la API');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchParticipants();
    }
  }, [userId, event]);

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

  const handleRemoveParticipant = async (participantId, participantName) => {
    const confirmDelete = window.confirm(`¿Desea eliminar a "${participantName}" como participante de este evento?`);
    if (!confirmDelete) return;

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
        fetchParticipants();
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar participante:', errorData);
        alert(`Error al eliminar participante: ${errorData.message || 'Desconocido'}`);
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
          <h2>Participantes</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          <div className="participants-list">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div key={participant.id} className="participant-item">
                  <p><strong>{participant.name}</strong></p>
                  <p>{participant.email}</p>

                  {/* Mostrar la X para eliminar participante solo si el usuario es admin o creador y no es el creador del evento */}
                  {(isAdmin || isCreator) && participant.id !== userId  && (
                    <button
                      className="remove-participant-btn"
                      onClick={() => handleRemoveParticipant(participant.id, participant.name)}
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No hay participantes registrados.</p>
            )}
          </div>
        </div>

        <div className="popup-footer">
          <div className="footer-buttons">
            {!isParticipating && !isCreator && (
              <button
                onClick={handleJoin}
                className="join-btn"
              >
                Unirse a la actividad
              </button>
            )}

            {isParticipating && !isCreator && (
              <button
                onClick={handleLeave}
                className="leave-btn"
              >
                Salir de la actividad
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPopup;
