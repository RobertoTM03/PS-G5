import React, { useState } from 'react';
import '../CSS/AddMemberModal.css';

export default function AddMemberModal({ onClose }) {
  const [username, setUsername] = useState('');

  const handleConfirm = () => {
    console.log('Nuevo miembro:', username);
    onClose(); // Cierra el modal después
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Añadir Miembro</h2>
        <div className="modal-content">
          <label className="username-label">Username:</label>
          <input
            className="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
