import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7979/api';

// Create axios instance with default config
const orderAPI = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
orderAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Order API Error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: error.message };
  }
);

export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - The order data
   * @returns {Promise<Object>} Created order response
   */
  createOrder: async (orderData) => {
    try {
      const response = await orderAPI.post('/', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get orders with pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Orders list with pagination
   */
  getOrders: async (params = {}) => {
    try {
      const response = await orderAPI.get('/', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single order by ID
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderById: async (orderId) => {
    try {
      const response = await orderAPI.get(`/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update order status
   * @param {string} orderId - The order ID
   * @param {Object} statusData - Status update data
   * @returns {Promise<Object>} Update response
   */
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await orderAPI.patch(`/${orderId}/status`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update payment information
   * @param {string} orderId - The order ID
   * @param {Object} paymentData - Payment update data
   * @returns {Promise<Object>} Update response
   */
  updatePaymentInfo: async (orderId, paymentData) => {
    try {
      const response = await orderAPI.patch(`/${orderId}/payment`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {string} orderId - The order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation response
   */
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await orderAPI.delete(`/${orderId}`, { 
        data: { reason } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order statistics (admin only)
   * @returns {Promise<Object>} Order statistics
   */
  getOrderStats: async () => {
    try {
      const response = await orderAPI.get('/stats/summary');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's orders
   * @param {string} userId - The user ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} User's orders
   */
  getUserOrders: async (userId, params = {}) => {
    try {
      const response = await orderAPI.get('/', { 
        params: { userId, ...params } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;