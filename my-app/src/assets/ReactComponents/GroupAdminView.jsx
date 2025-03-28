import React, { useEffect, useState } from 'react';
import '../CSS/GroupAdminView.css';
import Footer from './Footer.jsx';
import money from '../../pictures/money-bag.svg';
import calendar from '../../pictures/calendar.png';
import location from '../../pictures/location.svg';
import document from '../../pictures/document.svg';
import chat from '../../pictures/chat.svg';
import AddMemberModal from './AddMemberModal.jsx';
import Header from './Header.jsx';

export default function GroupAdminView() {
  const groupId = '1';
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: [],
    isOwner: false,
  });

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
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
        isOwner: data.isOwner || false, // 👈 Guardamos si es el creador
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
      setOpenMenuIndex(null);
    } catch (error) {
      console.error('Error eliminando miembro:', error.message || error);
      alert('Hubo un error al eliminar el miembro.');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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
          <p className="description-title">DESCRIPTION</p>
          <p className="group-description">{groupData.description}</p>

          <p className="members-title">GROUP MEMBERS</p>
          <div className="members-list">
            {groupData.members.length > 0 ? (
              groupData.members.map((member, index) => (
                <div key={index} className="member-item">
                  <span>{member.name}</span>
                  <div style={{ position: 'relative' }}>
                    <button
                      className="dots-button"
                      onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                    >
                      ⋮
                    </button>
                    {openMenuIndex === index && (
                      <div className="member-menu">
                        <button onClick={() => handleRemoveMember(index)}>Eliminar miembro</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No members yet.</p>
            )}
          </div>

          {groupData.isOwner ? (
            <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}>
              ADD MEMBER
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
                <p className="icon-label">Finance</p>
              </button>
              <button className="icon-btn">
                <img src={calendar} alt="Calendar" />
                <p className="icon-label">Calendar</p>
              </button>
              <button className="icon-btn">
                <img src={location} alt="Location" />
                <p className="icon-label">Location</p>
              </button>
            </div>
            <div className="icon-row center">
              <button className="icon-btn">
                <img src={document} alt="Documents" />
                <p className="icon-label">Documents</p>
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
