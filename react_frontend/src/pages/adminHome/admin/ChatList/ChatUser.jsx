function ChatUser({ user, onClick, isActive }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Chat with ${user.name}`}
    >
      {/* Avatar or initials */}
      <div className="avatar">
        {/* Replace with <img src={user.avatar} alt={user.name} /> if avatars used */}
        {user.initials}
      </div>

      {/* Info Block */}
      <div className="chat-info">
        <div className="chat-top">
          <span className="chat-name">{user.name}</span>
          <span className="chat-time">{user.time}</span>
        </div>
        <div className="chat-bottom">
          <span className="chat-message">{user.message}</span>
          {user.unread > 0 && (
            <span className="unread-badge" aria-label={`${user.unread} unread messages`}>
              {user.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
