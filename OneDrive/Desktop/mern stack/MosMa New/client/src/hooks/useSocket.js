// ─── useSocket.js ─────────────────────────────────────────────────────────────
// Custom hook for Socket.IO access throughout the app.
// ─────────────────────────────────────────────────────────────────────────────

import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * useSocket — Access the live socket instance and connection state.
 * Usage:  const { socket, isConnected } = useSocket();
 */
const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used inside a <SocketProvider>');
  }
  return context;
};

export default useSocket;
