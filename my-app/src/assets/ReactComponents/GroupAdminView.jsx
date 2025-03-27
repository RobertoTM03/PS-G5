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
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: [],
  });

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    // Puedes descomentar esto si quieres hacer el fetch real más adelante
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem('token'); // o sessionStorage
        const response = await fetch('http://localhost:3000/groups/1', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        const data = await response.json();
        console.log('Datos del grupo:', data);
    
        setGroupData({
          name: data.titulo || 'Unnamed Group',
          description: data.descripcion || 'No description provided.',
          members: (data.integrantes || []).map(user => ({ id: user.id, name: user.nombre })),
        });
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

     fetchGroupData();
  }, []);

  const handleRemoveMember = async (index) => {
    const memberToRemove = groupData.members[index];
    const groupId = '1';
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: String(memberToRemove.id),
        }),
      });
  
      const responseData = await response.json(); // <-- intenta leer la respuesta
  
      if (!response.ok) {
        console.error('Respuesta del servidor:', responseData);
        throw new Error(responseData.msg || 'Error al eliminar el miembro del servidor');
      }
  
      console.log('Miembro eliminado con éxito:', responseData);
  
      const updatedMembers = [...groupData.members];
      updatedMembers.splice(index, 1);
      setGroupData({ ...groupData, members: updatedMembers });
      setOpenMenuIndex(null);
    } catch (error) {
      console.error('Error eliminando miembro:', error.message || error);
      alert('Hubo un error al eliminar el miembro.');
    }
  };
  
  

  return (
    <div className="group-admin-wrapper">
      <Header />
      <div className="group-admin-container">
        {/* Left panel */}
        <div className="left-panel">
          <h2 className="group-title">{groupData.name || 'Group name'}</h2>
          <p className="description-title">DESCRIPTION</p>
          <p className="group-description">
            {groupData.description || 'Loading description...'}
          </p>

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

          <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}>
            ADD MEMBER
          </button>
        </div>

        {/* Right panel - Icon Buttons */}
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

      {/* Modal */}
      {showAddMemberModal && (
        <AddMemberModal onClose={() => setShowAddMemberModal(false)} />
      )}

      <Footer />
    </div>
  );
}
