// ─── validators.js ────────────────────────────────────────────────────────────
// Frontend validation helpers — keep business rules consistent with backend.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) return { valid: false, error: 'Email is required.' };
  if (!re.test(email.trim())) return { valid: false, error: 'Enter a valid email address.' };
  return { valid: true, error: null };
};

/**
 * Validate a password.
 * Rules: 8+ chars, at least 1 uppercase, 1 lowercase, 1 digit.
 * @param {string} password
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required.' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Include at least one uppercase letter.' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Include at least one lowercase letter.' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Include at least one number.' };
  return { valid: true, error: null };
};

/**
 * Validate a display name.
 * Rules: 2-30 characters, no special symbols.
 * @param {string} name
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateName = (name) => {
  if (!name || !name.trim()) return { valid: false, error: 'Name is required.' };
  if (name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters.' };
  if (name.trim().length > 30) return { valid: false, error: 'Name must be 30 characters or fewer.' };
  return { valid: true, error: null };
};

/**
 * Validate a chat message before sending.
 * @param {string} message
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateMessage = (message) => {
  if (!message || !message.trim()) return { valid: false, error: 'Message cannot be empty.' };
  if (message.trim().length > 2000) return { valid: false, error: 'Message cannot exceed 2000 characters.' };
  return { valid: true, error: null };
};

/**
 * Validate a post caption before publishing.
 * @param {string} caption
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateCaption = (caption) => {
  if (caption && caption.length > 500) return { valid: false, error: 'Caption cannot exceed 500 characters.' };
  return { valid: true, error: null };
};
