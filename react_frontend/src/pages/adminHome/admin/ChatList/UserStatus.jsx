import React from 'react';
import './UserStatus.css';

function UserStatus({ isOnline, lastSeen }) {
  const formatLastSeen = (lastSeenStr) => {
    if (!lastSeenStr) return '';

    const lastSeenDate = new Date(lastSeenStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="user-status">
      <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
      <span className="status-text">{isOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}</span>
    </div>
  );
}

export default UserStatus;
