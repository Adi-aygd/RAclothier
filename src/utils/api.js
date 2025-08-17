import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  const config = {
    headers: getAuthHeaders(isFormData),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Handle the new standardized response format
    if (
      data.type === 'success' &&
      data.status_code >= 200 &&
      data.status_code < 300
    ) {
      return data; // Return the full response object
    } else {
      // Handle errors based on status code or type
      if (response.status === 401 || data.status_code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error(data.message || 'Session expired. Please login again.');
      }
      throw new Error(data.message || 'Request failed');
    }
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData) =>
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
};

// Categories API functions
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (formData) =>
    apiRequest('/categories', {
      method: 'POST',
      body: formData, // FormData for file uploads
    }),
  update: (id, formData) =>
    apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: formData, // FormData for file uploads
    }),
  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

// Products API functions
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return apiRequest(endpoint);
  },
  getById: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'GET',
    }),
  create: (formData) =>
    apiRequest('/products', {
      method: 'POST',
      body: formData, // FormData for file uploads
    }),
  update: (id, formData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: formData, // FormData for file uploads
    }),
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Admin API functions
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getUsers: () => apiRequest('/admin/users'),
  updateUserRole: (userId, roleData) =>
    apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    }),
  deleteUser: (userId) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  getOrders: () => apiRequest('/admin/orders'),
  updateOrderStatus: (orderId, statusData) =>
    apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
};

export default {
  authAPI,
  categoriesAPI,
  productsAPI,
  adminAPI,
};
