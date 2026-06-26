// ─── MessageBubble.jsx ────────────────────────────────────────────────────────
// Renders a single chat message bubble. Handles own vs other's messages,
// image attachments, timestamps, and delete action for own messages.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { formatMessageTime } from '../../utils/formatDate';
import { deleteMessage } from '../../services/messageService';
import toast from 'react-hot-toast';

const MessageBubble = ({ message, currentUserId, onDeleted }) => {
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwn = message.sender?._id === currentUserId || message.sender === currentUserId;
  const senderName = message.sender?.name || 'Unknown';
  const senderAvatar = message.sender?.avatar;
  const initials = senderName.charAt(0).toUpperCase();

  const handleDelete = async () => {
    if (!window.confirm('Delete this message?')) return;
    setDeleting(true);
    try {
      await deleteMessage(message._id);
      onDeleted(message._id);
      toast.success('Message deleted');
    } catch {
      toast.error('Could not delete message');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`msg-bubble-wrapper ${isOwn ? 'own' : 'other'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar — only show for others */}
      {!isOwn && (
        <div className="msg-avatar">
          {senderAvatar ? (
            <img src={senderAvatar} alt={senderName} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      )}

      <div className="msg-content-col">
        {/* Sender name — only for others */}
        {!isOwn && <span className="msg-sender-name">{senderName}</span>}

        <div className="msg-bubble-row">
          <div className={`msg-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
            {/* Image attachment */}
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="attachment"
                className="msg-image"
                onClick={() => window.open(message.imageUrl, '_blank')}
              />
            )}

            {/* Text content */}
            {message.content && <p className="msg-text">{message.content}</p>}

            {/* Timestamp */}
            <span className="msg-time">{formatMessageTime(message.createdAt)}</span>
          </div>

          {/* Delete button for own messages */}
          {isOwn && showActions && (
            <button
              className="msg-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete message"
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
