// ─── RoomsPage.jsx ────────────────────────────────────────────────────────────
// Public channel discovery, user directory, and starting DMs page.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import RoomList from '../components/Rooms/RoomList';
import CreateRoomModal from '../components/Rooms/CreateRoomModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Hash, Users, MessageCircle, UserPlus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomsPage = () => {
  const { user, updateProfileCache } = useAuth();
  const navigate = useNavigate();

  const [publicRooms, setPublicRooms] = useState([]);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch discoverable public channels
  const fetchPublicRooms = async () => {
    try {
      const response = await api.get('/api/rooms');
      if (response.data && response.data.success) {
        setPublicRooms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching public rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch users for DM list & Friend directory
  const fetchDirectoryUsers = async () => {
    try {
      const response = await api.get('/api/users');
      if (response.data && response.data.success) {
        setDirectoryUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
    fetchDirectoryUsers();
  }, []);

  const handleRoomCreated = (newRoom) => {
    // Redirect straight to chat page for the new room
    navigate(`/chat?room=${newRoom._id}`);
  };

  // Start or open a DM conversation with a user
  const handleStartDM = async (targetUserId) => {
    try {
      const response = await api.post('/api/rooms/direct', { targetUserId });
      if (response.data && response.data.success) {
        const dmRoom = response.data.data;
        toast.success('Direct chat started!');
        navigate(`/chat?room=${dmRoom._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error starting chat';
      toast.error(msg);
    }
  };

  // Manage friend request actions
  const handleFriendAction = async (targetUserId) => {
    try {
      const response = await api.post(`/api/users/friend-request/${targetUserId}`);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Action completed');
        updateProfileCache(response.data.data);
        fetchDirectoryUsers(); // Refresh statuses
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error processing request';
      toast.error(msg);
    }
  };

  // Filter public rooms based on search query
  const filteredRooms = publicRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search query
  const filteredUsers = directoryUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="page-header-row">
          <div>
            <h1 className="page-main-title">Discovery</h1>
            <p className="page-main-subtitle">
              Join public channels, browse users, or start direct messaging
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="create-room-trigger-btn"
          >
            <Plus size={18} />
            <span>Create Channel</span>
          </button>
        </div>

        {/* Discovery Layout Split */}
        <div className="discovery-grid">
          {/* Public Channels Column */}
          <div className="discovery-section">
            <div className="section-search-header">
              <h3 className="discovery-section-title">Public Channels</h3>
              <div className="search-bar">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <RoomList
              rooms={filteredRooms}
              loading={loadingRooms}
              onJoined={fetchPublicRooms}
            />
          </div>

          {/* User Directory Column */}
          <div className="discovery-section user-directory-section">
            <div className="section-search-header">
              <h3 className="discovery-section-title">User Directory</h3>
              <div className="search-bar">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="search-input"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="loading-container">Loading users list...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <Users size={40} className="empty-icon" />
                <p>No other users registered yet.</p>
              </div>
            ) : (
              <div className="users-directory-list">
                {filteredUsers.map((item) => {
                  // Robust ObjectId vs string comparison
                  const isFriend = user.friends?.some((id) => id?.toString() === item._id?.toString());
                  const requestSent = item.friendRequests?.some((id) => id?.toString() === user._id?.toString());
                  const requestReceived = user.friendRequests?.some((id) => id?.toString() === item._id?.toString());

                  return (
                    <div key={item._id} className="directory-user-card">
                      <div className="directory-user-avatar-wrapper">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="directory-user-avatar"
                          />
                        ) : (
                          <div className="avatar-initials-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={`status-indicator status-${item.status || 'offline'}`} />
                      </div>

                      <div className="directory-user-info">
                        <h4 className="directory-user-name">{item.name}</h4>
                        <p className="directory-user-bio" title={item.bio}>
                          {item.bio || 'Hello, I am using MosMa!'}
                        </p>
                      </div>

                      <div className="directory-user-actions">
                        {/* DM Action Button */}
                        <button
                          onClick={() => handleStartDM(item._id)}
                          className="action-icon-btn dm-btn"
                          title="Send Direct Message"
                        >
                          <MessageCircle size={18} />
                        </button>

                        {/* Friend Action Button */}
                        <button
                          onClick={() => handleFriendAction(item._id)}
                          className={`action-icon-btn friend-btn ${isFriend ? 'is-friend' : ''}`}
                          title={
                            isFriend
                              ? 'Friends'
                              : requestSent
                              ? 'Request Sent (Click to Cancel)'
                              : requestReceived
                              ? 'Accept Friend Request'
                              : 'Add Friend'
                          }
                        >
                          {isFriend ? (
                            <Check size={18} />
                          ) : (
                            <UserPlus size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Create Room Modal */}
        <CreateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleRoomCreated}
        />
      </main>
    </div>
  );
};

export default RoomsPage;
