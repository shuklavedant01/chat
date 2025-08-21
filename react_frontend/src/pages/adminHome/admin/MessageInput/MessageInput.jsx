import { useState } from 'react';
import './MessageInput.css';
import { FaPaperclip } from 'react-icons/fa';
import { HiPaperAirplane } from 'react-icons/hi';
import { FiMic } from 'react-icons/fi';

function MessageInput({ onSend }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      {/* Attach File Icon */}
      <button
        type="button"
        className="icon-btn"
        title="Attach file"
        aria-label="Attach file"
        onClick={() => alert('File upload not implemented')}
      >
        <FaPaperclip color="#1d548bff" />
      </button>

      {/* Message Input */}
      <input
        type="text"
        className="message-input"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Microphone */}
      <button
        type="button"
        className="icon-btn"
        title="Record audio"
        aria-label="Record audio"
        onClick={() => alert('Voice recording not implemented')}
      >
        <FiMic className="icon" color="#1d548bff" />
      </button>

      {/* Emoji Picker */}
      <button
        type="button"
        className="icon-btn"
        title="Insert emoji"
        aria-label="Insert emoji"
        onClick={() => alert('Emoji picker not implemented')}
      >
        <span role="img" aria-label="emoji">
          😊
        </span>
      </button>

      {/* Send Message */}
      <button
        type="button"
        className="send-btn"
        title="Send"
        aria-label="Send message"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />
      </button>
    </div>
  );
}

export default MessageInput;
