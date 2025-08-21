import { useState } from 'react';
import axios from 'axios';
import LeftPanel from '../Leftpanel/LeftPanel';
import ChatList from '../ChatList/ChatList';
import ChatWindow from '../ChatWindow/ChatWindow';
import './ChatSection.css';

function ChatSection() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [roomMap, setRoomMap] = useState({});

  const user = localStorage.getItem('user');
  const user1Id = user ? JSON.parse(user).id : null;
  console.log('Current user ID:', user1Id);

  const headers = {
    'Content-Type': 'application/json',
  };
  const axiosConfig = { headers, withCredentials: true };

  const fetchOrCreateRoom = async (user2Id) => {
    if (!user1Id) {
      console.error('Current user ID not found');
      return null;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/chat/create-private-room/',
        {
          user1_id: Number(user1Id),
          user2_id: Number(user2Id),
        },
        axiosConfig,
      );
      return res.data.room_id;
    } catch (error) {
      console.error('Error creating room:', error.response ? error.response.data : error.message);
      return null;
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/chat/room-messages/${roomId}/`, axiosConfig);
      return res.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const handleSelectUser = async (user) => {
    if (!user) return;

    // Avoid re-selecting the same user
    if (selectedUser?.id === user.id) return;

    setSelectedUser(user);

    if (!roomMap[user.id]) {
      const roomId = await fetchOrCreateRoom(user.id);
      if (!roomId) return;

      const messages = await fetchMessages(roomId);

      setRoomMap((prev) => ({ ...prev, [user.id]: roomId }));
      setChatHistories((prev) => ({ ...prev, [user.id]: messages }));
    }
  };

  const handleSend = async (text) => {
    if (!selectedUser) return;

    const roomId = roomMap[selectedUser.id];
    if (!roomId) return;

    try {
      await axios.post(
        'http://localhost:8000/api/chat/send-message/',
        { room_id: roomId, text, sender_id: user1Id },
        axiosConfig,
      );

      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newMessage = {
        id: Date.now(),
        text,
        user: { username: 'You' }, // match backend user object
        timestamp: new Date().toISOString(),
        time,
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const roomId = selectedUser ? roomMap[selectedUser.id] : null;

  return (
    <div className="chat-container">
      <div className="leftpanel-wrapper">
        <LeftPanel />
      </div>

      <div className="chatlist-wrapper">
        <ChatList onSelectUser={handleSelectUser} selectedUser={selectedUser} />
      </div>

      <div className="mainchat-wrapper">
        {selectedUser && roomId ? (
          <ChatWindow
            user={{ ...selectedUser, roomId }}
            messages={chatHistories[selectedUser.id] || []}
            onSend={handleSend}
          />
        ) : (
          <div style={{ padding: '20px' }}>Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default ChatSection;
