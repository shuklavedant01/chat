import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import useChatSocket from '../../../../utils/hooks/useChatSocket';
import './ChatWindow.css';

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const senderId = JSON.parse(localStorage.getItem('user'))?.id;

  // WebSocket hook for real-time messaging
  useChatSocket(user?.roomId, (data) => {
    // Handle incoming WebSocket message
    const time = new Date(data.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg = {
      id: data.message_id || Date.now(),
      text: data.text,
      time,
      sender: data.sender_id === senderId ? 'user' : 'bot',
    };

    setMessages((prev) => {
      // Avoid duplicate messages by checking both id and text+timestamp
      const exists = prev.some(
        (m) =>
          m.id === newMsg.id || (m.text === newMsg.text && Math.abs(new Date(m.time) - new Date(newMsg.time)) < 1000),
      );
      if (exists) return prev;
      return [...prev, newMsg];
    });
  });

  useEffect(() => {
    if (!user?.roomId) {
      setMessages([]);
      return;
    }

    // Load existing messages
    axios
      .get(`http://localhost:8000/api/chat/room-messages/${user.roomId}/`)
      .then((res) => {
        const mapped = res.data.map((m) => ({
          id: m.id,
          text: m.text,
          time: new Date(m.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: m.user === senderId ? 'user' : 'bot',
        }));
        setMessages(mapped);
      })
      .catch((err) => {
        console.error('Failed to load messages:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
        }
      });
  }, [user, senderId]);

  const handleSend = (text) => {
    if (!text.trim() || !user?.roomId) return;

    const payload = {
      room_id: user.roomId,
      text,
      sender_id: senderId,
    };

    // Send via HTTP to Kafka (which will broadcast via WebSocket)
    axios
      .post('http://localhost:8000/api/chat/send-message/', payload)
      .then(() => {
        console.log('✅ Message sent successfully');
        // Don't add to state here - let WebSocket handle it
      })
      .catch((err) => {
        console.error('Failed to send message:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
        }
      });
  };

  if (!user) {
    return (
      <div className="h-100 flex-grow-1 bg-light d-flex align-items-center justify-content-center">
        <h5 className="text-muted">Select a chat to start messaging</h5>
      </div>
    );
  }

  return (
    <div className="h-100 flex-grow-1 bg-light d-flex flex-column">
      {/* Chat header */}
      <ChatHeader user={user} />

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default ChatWindow;
