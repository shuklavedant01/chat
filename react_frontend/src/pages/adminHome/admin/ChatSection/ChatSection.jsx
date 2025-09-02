import { useState, useEffect } from 'react';
import axios from 'axios';
import LeftPanel from '../Leftpanel/LeftPanel';
import ChatList from '../ChatList/ChatList';
import ChatWindow from '../ChatWindow/ChatWindow';
import useChatSocket from '../../../../utils/hooks/useChatSocket';
import './ChatSection.css';

function ChatSection() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [roomMap, setRoomMap] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [users, setUsers] = useState([]);

  const user = localStorage.getItem('user');
  const user1Id = user ? JSON.parse(user).id : null;
  console.log('Current user ID:', user1Id);

  const headers = {
    'Content-Type': 'application/json',
  };
  const axiosConfig = { headers, withCredentials: true };

  // Handle incoming real-time messages
  function handleReceiveMessage(messageData) {
    if (!selectedUser) return;

    const isFromCurrentUser = messageData.user?.id === user1Id || messageData.user === user1Id;

    if (!isFromCurrentUser) {
      const newMessage = {
        ...messageData,
        time: new Date(messageData.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender: 'bot',
        user: messageData.user?.id || messageData.user,
        sender_username: messageData.user?.username || messageData.sender_username,
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));
    }
  }

  // Handle user status updates
  function handleStatusUpdate(statusData) {
    setUserStatuses((prev) => ({
      ...prev,
      [statusData.user_id]: {
        is_online: statusData.is_online,
        last_seen: statusData.last_seen,
      },
    }));
  }

  const { sendMessage, isConnected } = useChatSocket(
    selectedUser ? roomMap[selectedUser.id] : null,
    handleReceiveMessage,
    handleStatusUpdate,
    user1Id,
  );

  const fetchUsersWithStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/chat/users-with-status/', axiosConfig);
      const usersData = res.data.users;
      setUsers(usersData);

      const statusMap = {};
      usersData.forEach((user) => {
        statusMap[user.id] = {
          is_online: user.is_online,
          last_seen: user.last_seen,
        };
      });
      setUserStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching users with status:', error);
    }
  };

  useEffect(() => {
    fetchUsersWithStatus();
    const statusInterval = setInterval(fetchUsersWithStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

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

  // Send message
  const handleSend = async (text) => {
    if (!text.trim() || !selectedUser) return;

    const roomId = roomMap[selectedUser.id];
    if (!roomId) {
      console.error('No room ID found for selected user');
      return;
    }

    // Define newMessage outside try so it's accessible in catch
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      user: user1Id,
      timestamp: new Date().toISOString(),
      sender_username: JSON.parse(localStorage.getItem('user'))?.username || 'You',
    };

    const payload = {
      room_id: roomId,
      text,
      sender_id: user1Id,
    };

    try {
      setChatHistories((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

      await axios.post('http://localhost:8000/api/chat/send-message/', payload, axiosConfig);

      if (sendMessage) {
        sendMessage(text, user1Id);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setChatHistories((prev) => ({
        ...prev,
        [selectedUser.id]: (prev[selectedUser.id] || []).filter((msg) => msg.id !== newMessage.id),
      }));
    }
  };

  const roomId = selectedUser ? roomMap[selectedUser.id] : null;

  return (
    <div className="chat-container">
      <div className="leftpanel-wrapper">
        <LeftPanel />
      </div>

      <div className="chatlist-wrapper">
        <ChatList
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
          users={users}
          userStatuses={userStatuses}
        />
      </div>

      <div className="mainchat-wrapper">
        {selectedUser && roomId ? (
          <ChatWindow
            user={{
              ...selectedUser,
              roomId,
              isOnline: userStatuses[selectedUser.id]?.is_online || false,
            }}
            messages={chatHistories[selectedUser.id] || []}
            onSend={handleSend}
            isConnected={isConnected}
          />
        ) : (
          <div style={{ padding: '20px' }}>Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default ChatSection;
