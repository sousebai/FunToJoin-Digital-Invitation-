// ─── ChatInput.jsx ────────────────────────────────────────────────────────────
// The message input bar at the bottom of the ChatPage.
// Supports text input, Enter-to-send, image attachment preview, and Emoji.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback } from 'react';
import { validateMessage } from '../../utils/validators';

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = useCallback(() => {
    const { valid, error: validationError } = validateMessage(text || (imageFile ? '[image]' : ''));
    if (!imageFile && !valid) {
      setError(validationError);
      return;
    }
    onSend({ text: text.trim(), imageFile });
    setText('');
    clearImage();
    setError('');
  }, [text, imageFile, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      {/* Image preview strip */}
      {imagePreview && (
        <div className="chat-image-preview">
          <img src={imagePreview} alt="preview" />
          <button className="chat-image-clear" onClick={clearImage} title="Remove image">✕</button>
        </div>
      )}

      {error && <p className="chat-input-error">{error}</p>}

      <div className="chat-input-bar">
        {/* Image attach button */}
        <button
          className="chat-icon-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
          disabled={disabled}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />

        {/* Text area */}
        <textarea
          className="chat-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          maxLength={2000}
          disabled={disabled}
        />

        {/* Send button */}
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !imageFile)}
          title="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
