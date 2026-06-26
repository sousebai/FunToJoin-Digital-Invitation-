// ─── Sidebar.jsx ──────────────────────────────────────────────────────────────
// Premium responsive sidebar component for navigation and room switcher.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ThemePicker from '../Common/ThemePicker';
import {
  MessageSquare,
  Compass,
  Home,
  LogOut,
  Plus,
  Hash,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ onRoomSelect }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch joined rooms/DMs list
  const fetchJoinedRooms = async () => {
    try {
      const response = await api.get('/api/rooms/joined');
      if (response.data && response.data.success) {
        setJoinedRooms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching joined rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoinedRooms();
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Helper to extract direct message receiver's info
  const getDMUserInfo = (room) => {
    if (room.type !== 'direct') return null;
    return room.members.find((member) => member._id !== user._id);
  };

  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home },
    { name: 'Discover Rooms', path: '/rooms', icon: Compass },
    { name: 'Chat Window', path: '/chat', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Header */}
      <div className="mobile-toggle-header">
        <button onClick={toggleMobile} className="mobile-menu-btn">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="mobile-header-logo">MosMa</span>
        <div className="mobile-user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" />
          ) : (
            <div className="avatar-initials">{user.name.charAt(0).toUpperCase()}</div>
          )}
        </div>
      </div>

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Branding header */}
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-logo-link">
            MosMa
          </Link>
        </div>

        {/* Global Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Channels Section (Group Rooms) */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="section-title">Joined Channels</span>
            <Link to="/rooms" className="section-action-btn" title="Discover Public Rooms">
              <Plus size={16} />
            </Link>
          </div>

          <div className="sidebar-section-list">
            {loadingRooms ? (
              <span className="section-info-text">Loading channels...</span>
            ) : joinedRooms.filter((r) => r.type !== 'direct').length === 0 ? (
              <span className="section-info-text">No joined channels.</span>
            ) : (
              joinedRooms
                .filter((r) => r.type !== 'direct')
                .map((room) => (
                  <NavLink
                    key={room._id}
                    to={`/chat?room=${room._id}`}
                    className={({ isActive }) =>
                      `room-nav-item ${isActive || location.search.includes(room._id) ? 'room-nav-active' : ''}`
                    }
                    onClick={() => {
                      setMobileOpen(false);
                      if (onRoomSelect) onRoomSelect(room);
                    }}
                  >
                    <Hash size={16} className="room-nav-icon" />
                    <span className="room-nav-name">{room.name}</span>
                  </NavLink>
                ))
            )}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="section-title">Direct Messages</span>
            <Link to="/rooms" className="section-action-btn" title="Start DM">
              <Plus size={16} />
            </Link>
          </div>

          <div className="sidebar-section-list">
            {loadingRooms ? (
              <span className="section-info-text">Loading chats...</span>
            ) : joinedRooms.filter((r) => r.type === 'direct').length === 0 ? (
              <span className="section-info-text">No active DMs.</span>
            ) : (
              joinedRooms
                .filter((r) => r.type === 'direct')
                .map((room) => {
                  const dmUser = getDMUserInfo(room);
                  if (!dmUser) return null;
                  return (
                    <NavLink
                      key={room._id}
                      to={`/chat?room=${room._id}`}
                      className={({ isActive }) =>
                        `room-nav-item dm-nav-item ${isActive || location.search.includes(room._id) ? 'room-nav-active' : ''}`
                      }
                      onClick={() => {
                        setMobileOpen(false);
                        if (onRoomSelect) onRoomSelect(room);
                      }}
                    >
                      <div className="dm-avatar-wrapper">
                        {dmUser.avatar ? (
                          <img src={dmUser.avatar} alt={dmUser.name} className="dm-nav-avatar" />
                        ) : (
                          <div className="avatar-initials-sm">{dmUser.name.charAt(0).toUpperCase()}</div>
                        )}
                        <span className={`status-indicator status-${dmUser.status || 'offline'}`} />
                      </div>
                      <span className="room-nav-name">{dmUser.name}</span>
                    </NavLink>
                  );
                })
            )}
          </div>
        </div>

        {/* User profile details & Logout section */}
        <div className="sidebar-footer">
          <div className="footer-user-info">
            <div className="user-avatar-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="footer-user-avatar" />
              ) : (
                <div className="avatar-initials">{user.name.charAt(0).toUpperCase()}</div>
              )}
              <span className="status-indicator status-online" />
            </div>
            <div className="user-details">
              <span className="user-display-name">{user.name}</span>
              <span className="user-display-email">{user.email}</span>
            </div>
          </div>
          <div className="sidebar-footer-actions">
            <ThemePicker />
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
