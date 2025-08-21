import { useEffect, useState } from 'react';
import './ChatList.css';
import ChatUser from './ChatUser';
import GroupUser from './GroupUser';
import axios from 'axios';

function ChatList({ onSelectUser, selectedUser }) {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatUsers, setChatUsers] = useState([]);

  // Placeholder for group chat users
  const [groupUsers] = useState([
    {
      id: 101,
      name: 'React Devs',
      message: 'Meeting at 5',
      time: 'Today',
      unread: 3,
      initials: 'RD',
      type: 'group',
    },
    {
      id: 102,
      name: 'UI Designers',
      message: 'Design shared',
      time: 'Yesterday',
      unread: 0,
      initials: 'UD',
      type: 'group',
    },
  ]);

  const currentUser = localStorage.getItem('user');
  const currentUserId = currentUser ? JSON.parse(currentUser).id : null;

  useEffect(() => {
    axios
      .get('http://localhost:8000/accounts/api/all_users/', {
        withCredentials: true,
      })
      .then((res) => {
        const filteredUsers = res.data.users.filter((u) => u.id !== currentUserId);

        const transformedUsers = filteredUsers.map((user) => ({
          id: user.id,
          username: user.username,
          name: user.username,
          message: `${user.designation || ''} - ${user.department || ''}`,
          time: 'Now',
          unread: 0,
          initials: user.username?.[0]?.toUpperCase() || '?',
          type: 'user',
        }));

        setChatUsers(transformedUsers);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      });
  }, [currentUserId]);

  const getFilteredUsers = () => {
    const list = activeTab === 'chats' ? chatUsers : groupUsers;
    return list.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const handleUserClick = (user) => {
    onSelectUser(user); // send selected user up to parent
  };

  return (
    <div className="chatlist-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="chatlist-tabs">
        <button type="button" className={activeTab === 'chats' ? 'active' : ''} onClick={() => setActiveTab('chats')}>
          Chats
        </button>
        <button type="button" className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>
          Groups
        </button>
      </div>

      <div className="chatlist-scroll">
        {getFilteredUsers().map((user) => {
          const isActive = selectedUser?.id === user.id && selectedUser?.type === user.type;

          return activeTab === 'chats' ? (
            <ChatUser key={user.id} user={user} isActive={isActive} onClick={() => handleUserClick(user)} />
          ) : (
            <GroupUser key={user.id} group={user} isActive={isActive} onClick={() => onSelectUser(user)} />
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
