import React, { useEffect, useRef } from 'react';
import './MessageList.css'; // Custom styles here

function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container-fluid py-3 message-list-container" style={{ height: '100%', overflowY: 'auto' }}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
        >
          <div
            className={`p-2 rounded-4 shadow-sm message-bubble ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
            style={{ maxWidth: '60%' }}
          >
            <div>{msg.text}</div>
            <div className="text-end small text-muted mt-1">{msg.time}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
