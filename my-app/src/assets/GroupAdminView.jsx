import React, { useEffect, useState } from 'react';
import './GroupAdminView.css';
import Footer from './Footer';
import money from '../pictures/money-bag.svg';
import calendar from '../pictures/calendar.png';
import location from '../pictures/location.svg';
import document from '../pictures/document.svg';
import chat from '../pictures/chat.svg';

export default function GroupAdminView() {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: [],
  });

  const [openMenuIndex, setOpenMenuIndex] = useState(null); // índice del menú desplegado

  useEffect(() => {
    const fakeData = {
      name: 'Desarrolladores Frontend',
      description: 'Grupo dedicado a compartir recursos y conocimientos sobre desarrollo frontend.',
      members: [
        { id: 1, name: 'Ana Pérez' },
        { id: 2, name: 'Carlos Gómez' },
        { id: 3, name: 'Lucía Fernández' },
        { id: 4, name: 'María Rodríguez' },
        { id: 5, name: 'Houda Ait' },
      ],
    };

    setGroupData({
      name: fakeData.name,
      description: fakeData.description,
      members: fakeData.members.map(user => user.name),
    });
  }, []);

  const handleRemoveMember = (index) => {
    const updatedMembers = [...groupData.members];
    updatedMembers.splice(index, 1);
    setGroupData({ ...groupData, members: updatedMembers });
    setOpenMenuIndex(null);
  };

  return (
    <div className="group-admin-wrapper">
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
                  <span>{member}</span>
                  <button className="dots-button" onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}>⋮</button>
                  {openMenuIndex === index && (
                    <div className="member-menu">
                      <button onClick={() => handleRemoveMember(index)}>Eliminar miembro</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No members yet.</p>
            )}
          </div>

          <button className="add-member-btn">ADD MEMBER</button>
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
      <Footer />
    </div>
  );
}
