/**
 * Format a numeric amount as Indian Rupee currency string.
 * @param {number} amount - The price amount to format.
 * @returns {string} Formatted price string (e.g., "₹1,499").
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate a UPI deep link URL for payment.
 * @param {number} amount - Payment amount in INR.
 * @param {string} orderId - The order ID used as transaction reference.
 * @returns {string} UPI deep link URL.
 */
export const generateUPIUrl = (amount, orderId) => {
  const upiId = import.meta.env.VITE_UPI_ID || '';
  const payeeName = 'PixelVault Store';
  const transactionNote = `Payment for order ${orderId}`;

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: 'INR',
    tn: transactionNote,
    tr: orderId,
  });

  return `upi://pay?${params.toString()}`;
};

/**
 * Truncate text to a specified maximum length with ellipsis.
 * @param {string} text - The text to truncate.
 * @param {number} [maxLength=100] - Maximum character length before truncation.
 * @returns {string} Truncated text with "..." appended if it exceeded maxLength.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Generate a unique order ID with "PV-" prefix followed by 8 random
 * alphanumeric uppercase characters.
 * @returns {string} Generated order ID (e.g., "PV-A3F7K9B2").
 */
export const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PV-';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

/**
 * Convert a date into a human-readable relative time string.
 * @param {Date|string|number} date - The date to convert.
 * @returns {string} Relative time string (e.g., "2 hours ago", "3 days ago").
 */
export const getTimeAgo = (date) => {
  if (!date) return 'Unknown';

  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) return 'Just now';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

/**
 * Map a product category to a react-icons Feather icon component name.
 * @param {string} category - The product category name.
 * @returns {string} The react-icons fi icon component name.
 */
export const getCategoryIcon = (category) => {
  const iconMap = {
    'eBooks': 'FiBook',
    'AI Prompts': 'FiCpu',
    'Presets': 'FiSliders',
    'Templates': 'FiLayout',
    'Courses': 'FiVideo',
    'APKs': 'FiSmartphone',
    'Editing Packs': 'FiFilm',
    'Tools': 'FiTool',
  };

  return iconMap[category] || 'FiPackage';
};
