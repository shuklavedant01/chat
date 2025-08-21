import React from 'react';
import './ChatHeader.css';
import { FaPhoneAlt, FaEllipsisV } from 'react-icons/fa';
import { MdScheduleSend } from 'react-icons/md';

function ChatHeader({ user }) {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="avatar">{user.initials}</div>
        <div className="user-info">
          <div className="username">{user.name}</div>
          <div className="status">{user.online ? 'Online' : 'Offline'}</div>
        </div>
      </div>

      <div className="chat-header-right">
        <MdScheduleSend className="header-icon" title="Schedule Message" />
        <FaPhoneAlt className="header-icon" title="Call" />
        <FaEllipsisV className="header-icon" title="More Options" />
      </div>
    </div>
  );
}

export default ChatHeader;
