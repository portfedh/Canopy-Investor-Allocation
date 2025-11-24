/**
 * Formatting utilities for displaying numbers and currency
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Parse currency input (remove $ and commas, convert to number)
 * @param {string} value - The input value to parse
 * @returns {number} - The parsed number
 */
export function parseCurrencyInput(value) {
  if (!value) return 0;

  // Remove $ and commas
  const cleaned = value.toString().replace(/[$,]/g, '');

  return parseFloat(cleaned) || 0;
}

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} - Formatted number (e.g., "1,234.56")
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(value);
}
