// ─── ChatRoom.js ──────────────────────────────────────────────────────────────
// Chat room data model.
// Supports public rooms (like Discord channels), private rooms, and 1-on-1 DMs.
//
// Room Types:
//   - 'public'  → Anyone can browse and join (shown in rooms list)
//   - 'private' → Invite only, not shown in public list
//   - 'direct'  → 1-on-1 direct message between exactly 2 users
//
// IMPORTANT:
//   - For 'direct' rooms, always check if a DM room between 2 users exists
//     before creating a new one (prevents duplicate DM threads).
//   - members array tracks who is currently in the room (joined).
//   - admin is the user who created the room and can delete it.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      minlength: [2, 'Room name must be at least 2 characters'],
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    type: {
      type: String,
      enum: ['public', 'private', 'direct'],
      default: 'public',
    },
    avatar: {
      type: String,
      default: '', // Cloudinary URL for room icon
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null, // Used to show preview in room list sidebar
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookup of direct message rooms between two users
chatRoomSchema.index({ type: 1, members: 1 });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
