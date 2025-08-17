/**
 * Format string to title case
 * @param {string} str
 * @returns {string}
 */
export const formatStringToTitleCase = (str) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convert text with new line to html <br> tags
 * Example: Egranin shirt – style meets comfort! ✨\r\n\r\n👕 premium quality
 * @param {string} text
 * @returns {string}
 */
export const convertTextToHtmlBr = (text) => {
  return text.replace(/\r\n\r\n/g, '<br /><br />').replace(/\r\n/g, '<br />');
};