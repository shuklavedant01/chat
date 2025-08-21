// ChatSidebar.jsx
import React from 'react';
import SidebarNavigation from '../Sidebar/Sidebar';

function ChatSidebar({ onToggleNotifications }) {
  return (
    <div className="p-3 d-flex flex-column h-100">
      <h5 className="mb-4">Chat Menu</h5>

      <button type="button" className="btn btn-outline-light mb-3" onClick={onToggleNotifications}>
        Toggle 🔔 Notifications
      </button>

      <SidebarNavigation />
    </div>
  );
}

export default ChatSidebar;
