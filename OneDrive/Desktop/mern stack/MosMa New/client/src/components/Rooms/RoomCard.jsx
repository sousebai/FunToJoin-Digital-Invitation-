// ─── RoomCard.jsx ─────────────────────────────────────────────────────────────
// UI card component representing a public chat channel available to join.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Users, Hash, Compass } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RoomCard = ({ room, onJoined }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const response = await api.post(`/api/rooms/${room._id}/join`);
      if (response.data && response.data.success) {
        toast.success(`Joined channel #${room.name}`);
        if (onJoined) onJoined(response.data.data);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error joining channel';
      toast.error(msg);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="room-card">
      <div className="room-card-header">
        <div className="room-card-avatar-wrapper">
          {room.avatar ? (
            <img src={room.avatar} alt={room.name} className="room-card-avatar" />
          ) : (
            <div className="room-card-placeholder">
              <Hash size={24} />
            </div>
          )}
        </div>
        <div className="room-card-meta">
          <h4 className="room-card-name">{room.name}</h4>
          <span className="room-card-creator">
            by {room.admin?.name || 'Admin'}
          </span>
        </div>
      </div>

      <p className="room-card-desc">
        {room.description || 'No description provided.'}
      </p>

      <div className="room-card-footer">
        <div className="member-count-wrapper">
          <Users size={16} className="member-icon" />
          <span className="member-count">{room.members?.length || 0} members</span>
        </div>
        <button
          className="join-channel-btn"
          onClick={handleJoin}
          disabled={isJoining}
        >
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
