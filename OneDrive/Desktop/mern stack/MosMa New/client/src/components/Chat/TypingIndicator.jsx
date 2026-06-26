// ─── TypingIndicator.jsx ──────────────────────────────────────────────────────
// Animated "user is typing…" indicator shown inside chat when others type.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

/**
 * @param {string[]} typingUsers — Array of display names currently typing
 */
const TypingIndicator = ({ typingUsers = [] }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  let label = '';
  if (typingUsers.length === 1) {
    label = `${typingUsers[0]} is typing…`;
  } else if (typingUsers.length === 2) {
    label = `${typingUsers[0]} and ${typingUsers[1]} are typing…`;
  } else {
    label = `${typingUsers.length} people are typing…`;
  }

  return (
    <div className="typing-indicator" aria-live="polite">
      <span className="typing-dots">
        <span /><span /><span />
      </span>
      <span className="typing-label">{label}</span>
    </div>
  );
};

export default TypingIndicator;
