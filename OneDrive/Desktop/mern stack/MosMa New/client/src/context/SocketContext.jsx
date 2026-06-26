// ─── SocketContext.jsx ────────────────────────────────────────────────────────
// React context managing the real-time Socket.IO connection.
//
// HOW IT WORKS:
//   - Connection details are derived from import.meta.env.VITE_SOCKET_URL.
//   - Connection is established ONLY when a user logs in (sends user ID on auth).
//   - Disconnects automatically on logout.
//   - Exposes the active socket instance globally.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    if (!user) {
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to Socket.IO server
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
      auth: {
        userId: user._id, // Send current user identity
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Setup global status event listeners
    newSocket.on('connect', () => {
      console.log('🔌 Connected to real-time messaging gateway.');
      setIsConnected(true);
      // Fetch currently online users list
      newSocket.emit('check_online_users', (onlineIds) => {
        setOnlineUserIds(onlineIds || []);
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    newSocket.on('user_online', ({ userId }) => {
      setOnlineUserIds((prev) => [...new Set([...prev, userId])]);
    });

    newSocket.on('user_offline', ({ userId }) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
