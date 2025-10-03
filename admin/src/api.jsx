import axios from 'axios';

// Get backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base URL
const API = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies
});

// Add request interceptor to include auth token in headers if needed
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin API endpoints
export const adminAPI = {
  // Login endpoint
  login: (credentials) => API.post('/api/admin/login', credentials),
  logout: () => API.post('/api/admin/logout'),
  // Check authentication status
  checkStatus: () => API.get('/api/admin/status'),
  
  // Forgot password - sends OTP to email
  forgotPassword: () => API.post('/api/admin/forgot_password'),
  
  // Reset password with OTP and new password
  resetPassword: (data) => API.post('/api/admin/reset_password', data),

  // Get events
  getEvents: () => API.get('/api/admin/events'),

  // Associations management
  getAssociations: () => API.get('/api/associations'),
  createAssociation: (data) => API.post('/api/associations', data),
  updateAssociation: (id, data) => API.put(`/api/associations/${id}`, data),
  deleteAssociation: (id) => API.delete(`/api/associations/${id}`),

  // Items management
  getItems: () => API.get('/api/items'),
  createItem: (data) => API.post('/api/items', data),
  updateItem: (id, data) => API.put(`/api/items/${id}`, data),
  deleteItem: (id) => API.delete(`/api/items/${id}`),

  // Stats
  getItemStats: () => API.get('/api/admin/stats/items'),

  // Event PDF
  getEventPDF: (eventId) => API.get(`/api/admin/events/pdf/${eventId}`, { responseType: 'blob' }),
  getRequestedEvents: () =>
    API.get('/api/admin/requested-events'),

  giveEditAccess: (id, access) =>
    API.post(`/api/admin/give-edit-access/${id}`, { access }),
};

export default API;
