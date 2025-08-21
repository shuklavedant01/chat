// import React from 'react';
import './LeftPanel.css';
import { FaHome, FaComments, FaUsers, FaCog, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function LeftPanel() {
  return (
    <div className="left-panel d-flex flex-column justify-content-between align-items-center py-2">
      {/* Top Icons */}
      <div className="d-flex flex-column align-items-center gap-4">
        <Link to="/user-home" title="Home Page" className="panel-link">
          <FaHome className="panel-icon" title="Home Page" />
        </Link>
        <FaComments className="panel-icon" title="Chats" />
        <FaUsers className="panel-icon" title="Contacts" />
        <FaCog className="panel-icon" title="Settings" />
      </div>

      {/* Bottom User Icon */}
      <div>
        <FaUserCircle className="panel-icon" title="Profile" />
      </div>
    </div>
  );
}

export default LeftPanel;
