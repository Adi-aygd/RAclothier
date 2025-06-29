// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
  TIMEOUT: 10000, // 10 seconds
};

export default API_CONFIG;
