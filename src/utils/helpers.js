// src/utils/helpers.js

/**
 * Truncate a string to a maximum length, appending ellipsis if needed.
 */
export const truncate = (str, max = 100) => {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…';
};

/**
 * Slugify a string for use in URLs.
 */
export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Debounce a function call.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Format a large number for display (e.g. 1200 → "1.2k")
 */
export const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

/**
 * Map Firebase auth error codes to human-readable messages.
 */
export const getAuthErrorMessage = (code) => {
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-closed-by-user': null, // silent
  };
  return map[code] ?? 'An unexpected error occurred. Please try again.';
};

/**
 * Validate a question form and return an error string or null.
 */
export const validateQuestion = ({ title, description, tags }) => {
  if (!title?.trim()) return 'Title is required.';
  if (title.trim().length < 10) return 'Title must be at least 10 characters.';
  if (title.trim().length > 200) return 'Title must be under 200 characters.';
  if (!description?.trim()) return 'Description is required.';
  if (description.trim().length < 20) return 'Description must be at least 20 characters.';
  if (!tags?.length) return 'At least one tag is required.';
  if (tags.length > 5) return 'Maximum 5 tags allowed.';
  return null;
};
