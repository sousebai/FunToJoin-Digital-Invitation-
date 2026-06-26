// ─── RoomList.jsx ─────────────────────────────────────────────────────────────
// Component to render the grid of discoverable public channels.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import RoomCard from './RoomCard';
import { Hash } from 'lucide-react';

const RoomList = ({ rooms, loading, onJoined }) => {
  if (loading) {
    return <div className="loading-container">Loading discoverable channels...</div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="empty-state">
        <Hash size={40} className="empty-icon" />
        <p>No discoverable channels found.</p>
      </div>
    );
  }

  return (
    <div className="rooms-cards-grid">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          onJoined={onJoined}
        />
      ))}
    </div>
  );
};

export default RoomList;
