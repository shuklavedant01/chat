import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Chats</h3>
      <ul className="chat-list">
        <li>Job.Society</li>
        <li>Sumbul Rizvi</li>
        <li>BCA Family</li>
        <li>Project CODE WAR</li>
        <li>BCA 2022-25 BOYS</li>
        {/* Add more static or dynamic chats */}
      </ul>
    </div>
  );
}

export default Sidebar;
