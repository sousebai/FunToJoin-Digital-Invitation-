// ─── Message.js ───────────────────────────────────────────────────────────────
// Message data model.
// Each message belongs to a ChatRoom and is sent by a User.
//
// Message Types:
//   - 'text'  → Plain text message
//   - 'image' → Image uploaded to Cloudinary (imageUrl is set)
//   - 'emoji' → Standalone emoji message
//   - 'system' → System notification (e.g., "John joined the room")
//
// IMPORTANT:
//   - readBy tracks which users have seen the message (for read receipts).
//   - replyTo references another Message for threaded replies.
//   - deleted messages set isDeleted=true but stay in DB (for reply reference).
//   - When fetching messages, filter out isDeleted=true or show "Message deleted".
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    content: {
      type: String,
      required: function () {
        // Content is required for text/emoji/system messages but not image-only
        return this.type !== 'image';
      },
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'emoji', 'system'],
      default: 'text',
    },
    imageUrl: {
      type: String,
      default: '', // Cloudinary URL — only set when type is 'image'
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null, // References the message being replied to
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // The sender is automatically added to readBy on creation
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete — message stays in DB but shows as "deleted"
    },
  },
  {
    timestamps: true, // createdAt = message timestamp
  }
);

// Index for faster message fetching per room (most common query)
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
