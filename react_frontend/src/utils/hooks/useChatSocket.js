import { useEffect, useRef, useState } from 'react';

/**
 * Hook for WebSocket Chat Messaging with real-time updates and user status
 * @param {string} roomId - The chat room ID from backend
 * @param {function} onReceive - Callback to handle incoming message
 * @param {function} onStatusUpdate - Callback to handle user status updates
 * @param {number} userId - Current user ID for status updates
 */
export default function useChatSocket(roomId, onReceive, onStatusUpdate, userId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Function to update user status via API
  const updateUserStatus = async (userId, isOnline) => {
    try {
      await fetch('http://localhost:8000/api/chat/update-user-status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          is_online: isOnline,
        }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  useEffect(() => {
    if (!roomId) {
      return () => {};
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected to room:', roomId);
      setIsConnected(true);

      // Update user status to online
      if (userId) {
        updateUserStatus(userId, true);
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message' && onReceive) {
          onReceive(data.message);
        } else if (data.type === 'user_status_update' && onStatusUpdate) {
          onStatusUpdate(data.status);
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      setIsConnected(false);
    };

    socket.onclose = (e) => {
      console.log('🔌 WebSocket disconnected:', e.reason || 'closed');
      setIsConnected(false);

      // Update user status to offline
      if (userId) {
        updateUserStatus(userId, false);
      }
    };

    // Cleanup when component unmounts or roomId changes
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        console.log('🧹 Closing WebSocket for room:', roomId);
        socket.close();
      }
      // Update user status to offline on cleanup
      if (userId) {
        updateUserStatus(userId, false);
      }
    };
  }, [roomId, onReceive, onStatusUpdate, userId]);

  // Send message via WebSocket
  const sendMessage = (text, senderId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          text,
          sender_id: senderId,
        }),
      );
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent.');
    }
  };

  return { sendMessage, isConnected };
}
