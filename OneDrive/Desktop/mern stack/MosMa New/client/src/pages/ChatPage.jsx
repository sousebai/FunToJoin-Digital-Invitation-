// ─── ChatPage.jsx ─────────────────────────────────────────────────────────────
// Step 4: Real-Time Chat Room Page
// ─────────────────────────────────────────────────────────────────────────────
// Features:
//  • Sidebar with joined rooms + room search
//  • Real-time messaging via Socket.IO
//  • Message history loaded from REST API (paginated)
//  • Typing indicators (live, debounced)
//  • Online member list
//  • Image message support
//  • Auto-scroll to latest message
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getRoomMessages } from '../services/messageService';
import { getMyRooms } from '../services/roomService';
import api from '../services/api';
import MessageBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import TypingIndicator from '../components/Chat/TypingIndicator';
import Sidebar from '../components/Layout/Sidebar';

// ─── Typing debounce constant (ms) ───────────────────────────────────────────
const TYPING_TIMEOUT = 2000;

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Read ?room=<roomId> from URL

  // ─── State ───────────────────────────────────────────────────────────────
  const [myRooms, setMyRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [roomSearch, setRoomSearch] = useState('');

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  // ─── Load user's rooms ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getMyRooms();
        setMyRooms(rooms);
        // If URL has ?room=<id>, auto-select that room; otherwise pick first
        const targetRoomId = searchParams.get('room');
        if (targetRoomId) {
          const targetRoom = rooms.find((r) => r._id === targetRoomId);
          if (targetRoom) {
            handleRoomSelect(targetRoom);
          } else if (rooms.length > 0) {
            handleRoomSelect(rooms[0]);
          }
        } else if (rooms.length > 0 && !activeRoom) {
          handleRoomSelect(rooms[0]);
        }
      } catch {
        toast.error('Failed to load your rooms');
      }
    };
    fetchRooms();
  }, [searchParams]);

  // ─── Load message history when room changes ───────────────────────────────
  const loadMessages = useCallback(async (roomId, pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getRoomMessages(roomId, pageNum);
      const incoming = data.messages || [];
      if (pageNum === 1) {
        setMessages(incoming);
      } else {
        setMessages((prev) => [...incoming, ...prev]);
      }
      setHasMore(pageNum < (data.totalPages || 1));
    } catch {
      toast.error('Could not load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Select a room ────────────────────────────────────────────────────────
  const handleRoomSelect = useCallback((room) => {
    // Leave previous room socket
    if (activeRoom && socket) {
      socket.emit('leave_room', { roomId: activeRoom._id });
    }
    setActiveRoom(room);
    setMessages([]);
    setTypingUsers([]);
    setPage(1);
    setHasMore(false);
    loadMessages(room._id, 1);
    if (socket && isConnected) {
      socket.emit('join_room', { roomId: room._id });
    }
  }, [activeRoom, socket, isConnected, loadMessages]);

  // ─── Socket.IO event listeners ────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !activeRoom) return;

    // Receive new message — checks both string 'room' and populated 'room._id'
    const onNewMessage = (msg) => {
      const msgRoomId = msg.room?._id || msg.room;
      if (msgRoomId?.toString() === activeRoom._id?.toString()) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    // Typing start
    const onTypingStart = ({ userId, userName }) => {
      if (userId === user._id) return;
      setTypingUsers((prev) =>
        prev.includes(userName) ? prev : [...prev, userName]
      );
    };

    // Typing stop
    const onTypingStop = ({ userId, userName }) => {
      setTypingUsers((prev) => prev.filter((n) => n !== userName));
    };

    // Online members update
    const onOnlineUpdate = ({ roomId, onlineUsers }) => {
      if (roomId === activeRoom._id) setOnlineMembers(onlineUsers || []);
    };

    // Message deleted by someone
    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    // ✅ 'receive_message' matches server emit in socketHandler.js
    socket.on('receive_message', onNewMessage);
    socket.on('typing_start', onTypingStart);
    socket.on('typing_stop', onTypingStop);
    socket.on('online_users', onOnlineUpdate);
    socket.on('message_deleted', onMessageDeleted);

    return () => {
      socket.off('receive_message', onNewMessage);
      socket.off('typing_start', onTypingStart);
      socket.off('typing_stop', onTypingStop);
      socket.off('online_users', onOnlineUpdate);
      socket.off('message_deleted', onMessageDeleted);
    };
  }, [socket, activeRoom, user]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSend = useCallback(async ({ text, imageFile }) => {
    if (!socket || !activeRoom || !isConnected) {
      toast.error('Not connected. Please refresh.');
      return;
    }

    // Stop typing
    emitTypingStop();

    if (imageFile) {
      // Upload image first via REST, then emit the resulting message
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('content', text || '');
      formData.append('room', activeRoom._id); // ✅ must match req.body.room in controller

      try {
        await api.post('/api/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Server broadcasts via socket — no local push needed
      } catch (err) {
        console.error('Error uploading message attachment:', err);
        toast.error('Failed to send image');
      }
    } else {
      // Text-only — emit directly via socket
      // 'room' matches socketHandler.js check: message.room
      socket.emit('send_message', {
        room: activeRoom._id,
        content: text,
        sender: { _id: user._id, name: user.name, avatar: user.avatar },
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        type: 'text',
      });
    }
  }, [socket, activeRoom, isConnected]);

  // ─── Typing events ────────────────────────────────────────────────────────
  const emitTypingStop = useCallback(() => {
    if (socket && activeRoom && isTypingRef.current) {
      socket.emit('typing_stop', { roomId: activeRoom._id });
      isTypingRef.current = false;
    }
  }, [socket, activeRoom]);

  const handleTyping = useCallback(() => {
    if (!socket || !activeRoom || !isConnected) return;
    if (!isTypingRef.current) {
      socket.emit('typing_start', { roomId: activeRoom._id });
      isTypingRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(emitTypingStop, TYPING_TIMEOUT);
  }, [socket, activeRoom, isConnected, emitTypingStop]);

  // ─── Load older messages (pagination) ─────────────────────────────────────
  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadMessages(activeRoom._id, nextPage);
  };

  // ─── Delete message (local removal) ──────────────────────────────────────
  const handleMessageDeleted = (msgId) => {
    setMessages((prev) => prev.filter((m) => m._id !== msgId));
  };

  // ─── Filtered room list ───────────────────────────────────────────────────
  const filteredRooms = myRooms.filter((r) =>
    r.name?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar activePage="chat" />

      <main className="chat-layout">
        {/* ── Left panel: Room list ────────────────────────────────────── */}
        <aside className="chat-rooms-panel">
          <div className="chat-rooms-header">
            <h2 className="chat-rooms-title">💬 My Rooms</h2>
            <input
              className="chat-room-search"
              placeholder="Search rooms…"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
            />
          </div>

          <ul className="chat-room-list">
            {filteredRooms.length === 0 && (
              <li className="chat-room-empty">
                No rooms yet.{' '}
                <button className="link-btn" onClick={() => navigate('/rooms')}>
                  Browse rooms →
                </button>
              </li>
            )}
            {filteredRooms.map((room) => (
              <li
                key={room._id}
                className={`chat-room-item ${activeRoom?._id === room._id ? 'active' : ''}`}
                onClick={() => handleRoomSelect(room)}
              >
                <div className="chat-room-icon">
                  {room.isPrivate ? '🔒' : '#'}
                </div>
                <div className="chat-room-info">
                  <span className="chat-room-name">{room.name}</span>
                  <span className="chat-room-members">
                    {room.members?.length || 0} members
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="browse-rooms-btn"
            onClick={() => navigate('/rooms')}
          >
            + Browse / Create Rooms
          </button>
        </aside>

        {/* ── Right panel: Chat window ──────────────────────────────────── */}
        <section className="chat-window">
          {activeRoom ? (
            <>
              {/* Room header */}
              <header className="chat-window-header">
                <div className="chat-room-title-bar">
                  <h3 className="chat-active-room-name">
                    {activeRoom.isPrivate ? '🔒' : '#'} {activeRoom.name}
                  </h3>
                  {activeRoom.description && (
                    <p className="chat-room-desc">{activeRoom.description}</p>
                  )}
                </div>
                <div className="chat-header-meta">
                  {!isConnected && (
                    <span className="conn-badge disconnected">● Reconnecting…</span>
                  )}
                  {isConnected && (
                    <span className="conn-badge connected">
                      ● {onlineMembers.length} online
                    </span>
                  )}
                </div>
              </header>

              {/* Messages area */}
              <div className="chat-messages-area" onScroll={() => {}}>
                {/* Load older messages */}
                {hasMore && (
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading…' : '↑ Load older messages'}
                  </button>
                )}

                {loading && messages.length === 0 && (
                  <div className="chat-loading">
                    <span className="spinner" />
                    <p>Loading messages…</p>
                  </div>
                )}

                {!loading && messages.length === 0 && (
                  <div className="chat-empty">
                    <p>👋 No messages yet. Be the first to say something!</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    currentUserId={user._id}
                    onDeleted={handleMessageDeleted}
                  />
                ))}

                {/* Typing indicator */}
                <TypingIndicator typingUsers={typingUsers} />

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <ChatInput
                onSend={handleSend}
                onTyping={handleTyping}
                disabled={!isConnected}
              />
            </>
          ) : (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">💬</div>
              <h2>Welcome to MosMa Chat</h2>
              <p>Select a room on the left to start chatting, or browse available rooms.</p>
              <button className="btn-primary" onClick={() => navigate('/rooms')}>
                Browse Rooms
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChatPage;
