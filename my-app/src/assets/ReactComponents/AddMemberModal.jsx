import React, { useState } from 'react';
import '../CSS/AddMemberModal.css';

export default function AddMemberModal({ onClose, groupId, token }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConfirm = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(`✅ Usuario "${email}" añadido exitosamente al grupo.`);
        setEmail(''); // Limpiar el campo de email
      } else {
        switch (response.status) {
          case 400:
            setError('⚠️ El usuario ya es integrante o el email no es válido.');
            break;
          case 401:
            setError('🔒 Fallo de autenticación. Verifica tu sesión.');
            break;
          case 403:
            setError('🚫 No tienes permiso para realizar esta acción.');
            break;
          case 404:
            setError('❌ Usuario no registrado o grupo no encontrado.');
            break;
          default:
            setError('😵 Error desconocido del servidor.');
        }
      }
    } catch (err) {
      setError('🌐 Error de red o del servidor. Intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Añadir Miembro</h2>
        <div className="modal-content">
          <label className="username-label">Email:</label>
          <input
            className="username-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@example.com"
          />
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </div>
        <div className="modal-footer">
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirmar
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
