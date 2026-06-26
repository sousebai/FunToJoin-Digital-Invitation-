// ─── socketHandler.js ─────────────────────────────────────────────────────────
// Complete Socket.IO event handler.
//
// Highlights:
//   - Connection/identity verification using handshake details.
//   - Dynamic channel grouping via socket.join(roomId).
//   - Real-time message broadcasting, typing indicators, and online status.
//   - Disconnect handling and cleanup of the online status mapping.
// ─────────────────────────────────────────────────────────────────────────────

// In-memory mapping of active users: userId (string) → socketId (string)
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── User Identity Registration ───────────────────────────────────────────
    // Client sends their userId in the handshake.auth options
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`🟢 User registered: User ${userId} on Socket ${socket.id}`);
      
      // Broadcast globally that this user is online
      io.emit('user_online', { userId });
    }

    // ── Join a Room ──────────────────────────────────────────────────────────
    socket.on('join_room', ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
    });

    // ── Leave a Room ─────────────────────────────────────────────────────────
    socket.on('leave_room', ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`📤 Socket ${socket.id} left room: ${roomId}`);
    });

    // ── Send Message ─────────────────────────────────────────────────────────
    socket.on('send_message', (message) => {
      if (!message || !message.room) return;
      
      // Broadcast the message object to all clients in the room (including sender)
      io.to(message.room).emit('receive_message', message);
    });

    // ── Typing Indicators ────────────────────────────────────────────────────
    socket.on('typing_start', ({ roomId, userName }) => {
      if (!roomId || !userId) return;
      // Notify everyone in the room EXCEPT the sender
      socket.to(roomId).emit('user_typing', { roomId, userId, userName, isTyping: true });
    });

    socket.on('typing_stop', ({ roomId }) => {
      if (!roomId || !userId) return;
      // Notify everyone in the room EXCEPT the sender
      socket.to(roomId).emit('user_typing', { roomId, userId, isTyping: false });
    });

    // ── Read Receipts ────────────────────────────────────────────────────────
    socket.on('mark_read', ({ messageId, roomId }) => {
      if (!messageId || !roomId || !userId) return;
      
      // Broadcast read receipt to others in the room
      socket.to(roomId).emit('read_receipt', { messageId, userId, roomId });
    });

    // ── User Status Check ────────────────────────────────────────────────────
    // Allows new connectees to query which of their friends are online
    socket.on('check_online_users', (callback) => {
      if (typeof callback === 'function') {
        callback(Array.from(onlineUsers.keys()));
      }
    });

    // ── Disconnection Cleanup ────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} (reason: ${reason})`);

      if (userId && onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🔴 User deregistered: User ${userId} went offline`);
        
        // Notify all clients that this user went offline
        io.emit('user_offline', { userId });
      }
    });
  });
};

export default socketHandler;
export { onlineUsers };
