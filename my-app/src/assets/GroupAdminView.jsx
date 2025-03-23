import React from 'react';
import './GroupAdminView.css';
import Footer from './Footer';
import money from '../pictures/money-bag.svg';
import calendar from '../pictures/calendar.png';
import location from '../pictures/location.svg';
import document from '../pictures/document.svg';
import chat from '../pictures/chat.svg';

export default function GroupAdminView() {
  return (
    <div className="group-admin-wrapper">
      <div className="group-admin-container">
        {/* Left panel */}
        <div className="left-panel">
          <h2 className="group-title">Group name</h2>
          <p className="description-title">DESCRIPTION</p>
          <p className="group-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </p>

          <p className="members-title">GROUP MEMBERS</p>
          <div className="members-list">
            {/* Members should be dynamically generated here */}
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

      {/* Footer component at the bottom */}
      <Footer />
    </div>
  );
}
