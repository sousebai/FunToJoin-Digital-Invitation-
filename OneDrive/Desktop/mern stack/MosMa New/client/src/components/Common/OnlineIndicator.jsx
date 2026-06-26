// ─── OnlineIndicator.jsx ─────────────────────────────────────────────────────
// Small green dot indicator shown next to avatars when a user is online.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

/**
 * @param {boolean} isOnline  — Whether to show the green dot
 * @param {string}  size      — 'sm' | 'md' | 'lg'  (default: 'sm')
 */
const OnlineIndicator = ({ isOnline, size = 'sm' }) => {
  if (!isOnline) return null;

  const sizeMap = { sm: 10, md: 13, lg: 16 };
  const px = sizeMap[size] || 10;

  return (
    <span
      className="online-dot"
      style={{ width: px, height: px }}
      title="Online"
      aria-label="Online"
    />
  );
};

export default OnlineIndicator;
