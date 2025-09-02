import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import './ChatWindow.css';

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const senderId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (!user?.roomId) {
      setMessages([]);
      return;
    }

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
          username: m.sender_username || 'Guest',
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

    axios
      .post('http://localhost:8000/api/chat/send-message/', payload)
      .then(() => {
        const time = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const newMsg = {
          id: Date.now(),
          text,
          sender: 'user',
          time,
        };

        setMessages((prev) => [...prev, newMsg]);
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
