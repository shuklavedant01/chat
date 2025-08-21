function GroupUser({ group, onClick, isActive }) {
  return (
    <div
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
    >
      <div className="avatar">{group.initials}</div>
      <div className="chat-info">
        <div className="chat-top">
          <span className="chat-name">{group.name}</span>
          <span className="chat-time">{group.time}</span>
        </div>
        <div className="chat-bottom">
          <span className="chat-message">{group.message}</span>
          {group.unread > 0 && <span className="unread-badge">{group.unread}</span>}
        </div>
      </div>
    </div>
  );
}
export default GroupUser;
