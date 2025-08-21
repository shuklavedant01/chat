import { useEffect, useRef } from 'react';

/**
 * Hook for WebSocket Chat Messaging
 * @param {string} roomId - The chat room ID from backend
 * @param {function} onReceive - Callback to handle incoming message
 */
export default function useChatSocket(roomId, onReceive) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      // ✅ Always return a function for cleanup
      return () => {};
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected to room:', roomId);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onReceive && typeof onReceive === 'function') {
          onReceive(data);
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    socket.onclose = (e) => {
      console.log('🔌 WebSocket disconnected:', e.reason || 'closed');
    };

    // ✅ Cleanup when component unmounts or roomId changes
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        console.log('🧹 Closing WebSocket for room:', roomId);
        socket.close();
      }
    };
  }, [roomId, onReceive]);

  // 📤 Send message via WebSocket
  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text }));
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent.');
    }
  };

  return { sendMessage };
}
