// ─── formatDate.js ────────────────────────────────────────────────────────────
// Date/time formatting helpers used throughout the UI.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an ISO timestamp into a human-readable time string.
 * Shows "2:34 PM" if today, "Jun 25" if same year, "Jun 25, 2025" otherwise.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatMessageTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const isSameYear = date.getFullYear() === now.getFullYear();
  if (isSameYear) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Returns a relative time string like "3 minutes ago", "2 hours ago", "Yesterday".
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const timeAgo = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/**
 * Format a date for post cards in the Feed (e.g. "June 25 at 2:34 PM").
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatPostDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toLocaleDateString([], { month: 'long', day: 'numeric' }) +
    ' at ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
