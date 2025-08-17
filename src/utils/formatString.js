/**
 * Format string to title case
 * @param {string} str
 * @returns {string}
 */
export const formatStringToTitleCase = (str) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};
