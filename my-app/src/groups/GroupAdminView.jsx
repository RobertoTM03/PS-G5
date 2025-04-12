import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './GroupAdminView.css';

import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';

import AddMemberModal from './AddMemberModal.jsx';

import money from '../../assets/pictures/money-bag.svg';
import calendar from '../../assets/pictures/calendar.png';
import location from '../../assets/pictures/location.svg';
import document from '../../assets/pictures/document.svg';
import chat from '../../assets/pictures/chat.svg';

export default function GroupAdminView() {
  const { id } = useParams();
  const groupId = id;

  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: [],
    isOwner: false,
  });

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      setGroupData({
        name: data.titulo || 'Unnamed Group',
        description: data.descripcion || 'No description provided.',
        members: (data.integrantes || []).map(user => ({
          id: user.userId,
          name: user.nombre,
        })),
        isOwner: data.isOwner || false,
      });
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, []);

  const handleRemoveMember = async (index) => {
    const memberToRemove = groupData.members[index];

    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar a ${memberToRemove.name} del grupo?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token no encontrado. Por favor, inicia sesión.');
        return;
      }

      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: String(memberToRemove.id) }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.msg || 'Error al eliminar el miembro');
      }

      const updatedMembers = [...groupData.members];
      updatedMembers.splice(index, 1);
      setGroupData({ ...groupData, members: updatedMembers });
    } catch (error) {
      console.error('Error eliminando miembro:', error.message || error);
      alert('Hubo un error al eliminar el miembro.');
    }
  };

  const handleLeaveGroup = async () => {
    const confirmLeave = window.confirm('¿Estás seguro de que quieres salir del grupo?');
    if (!confirmLeave) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token no encontrado. Por favor, inicia sesión.');
        return;
      }

      const response = await fetch(`http://localhost:3000/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'No se pudo salir del grupo.');
      }

      alert('Saliste del grupo correctamente.');
      window.location.href = '/vistaGrupos';
    } catch (error) {
      console.error('Error al salir del grupo:', error.message || error);
      alert('Hubo un error al intentar salir del grupo.');
    }
  };

  return (
    <div className="group-admin-wrapper">
      <Header />
      <div className="group-admin-container">
        <div className="left-panel">
          <h2 className="group-title">{groupData.name}</h2>
          <p className="description-title">DESCRIPCIÓN</p>
          <p className="group-description">{groupData.description}</p>

          <p className="members-title">MIEMBROS</p>
          <div className="members-list">
            {groupData.members.length > 0 ? (
              groupData.members.map((member, index) => (
                <div key={index} className="member-item">
                  <span>{member.name}</span>
                  {groupData.isOwner && (
                    <button
                      className="trash-button"
                      onClick={() => handleRemoveMember(index)}
                      title="Eliminar miembro"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No hay miembros.</p>
            )}
          </div>

          {groupData.isOwner ? (
            <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}>
              Añadir miembro
            </button>
          ) : (
            <button className="add-member-btn" onClick={handleLeaveGroup}>
              SALIR DEL GRUPO
            </button>
          )}
        </div>

        <div className="right-panel">
          <div className="icon-rows">
            <div className="icon-row">
              <button className="icon-btn">
                <img src={money} alt="Finance" />
                <p className="icon-label">Gastos</p>
              </button>
              <button className="icon-btn">
                <img src={calendar} alt="Calendar" />
                <p className="icon-label">Calendario</p>
              </button>
              <button className="icon-btn">
                <img src={location} alt="Location" />
                <p className="icon-label">Mapa</p>
              </button>
            </div>
            <div className="icon-row center">
              <button className="icon-btn">
                <img src={document} alt="Documents" />
                <p className="icon-label">Documentos</p>
              </button>
              <button className="icon-btn">
                <img src={chat} alt="Chat" />
                <p className="icon-label">Chat</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => {
            setShowAddMemberModal(false);
            fetchGroupData();
          }}
          groupId={groupId}
        />
      )}

      <Footer />
    </div>
  );
}
