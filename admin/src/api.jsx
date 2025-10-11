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
  // Logs endpoint
  getLogs: () => API.get('/api/admin/logs'),
  // OTP login endpoints
  sendOtp: (email) => API.post('/api/admin/send-otp', { email }),
  verifyOtp: (email, otp) => API.post('/api/admin/verify-otp', { email, otp }),
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
  
  // Get events by association ID
  getEventsByAssociation: (associationId) => API.get(`/api/events/association/${associationId}/event-ids`),

  // Items management
  getItems: () => API.get('/api/items'),
  createItem: (data) => API.post('/api/items', data),
  updateItem: (id, data) => API.put(`/api/items/${id}`, data),
  deleteItem: (id) => API.delete(`/api/items/${id}`),
  updateItemQuantity: (id, quantity) => API.patch(`/api/items/${id}/quantity`, { available_quantity:quantity }),

  // Grant items functionality
  getEventQuantityToProvide: (eventId) => API.get(`/api/grant/${eventId}/quantity-to-provide`),
  grantItemsToEvent: (data) => API.post('/api/grant', data),
  getEventGrantHistory: (eventId) => API.get(`/api/grant/event/${eventId}`),
  revertGrant: (grantId) => API.delete(`/api/grant/${grantId}`),
  getAllGrants: () => API.get('/api/grant/all'),
  updateSuSource: (data) => API.post('/api/grant/update-su-source', data),
  getProcurementPDF: (eventId) => API.get(`/api/grant/procurement-pdf/${eventId}`, { responseType: 'blob', transformResponse: [(data) => data], }),
  

  // Stocks
  getStocks: () => API.get('/api/items'),

  // Stats
  getItemStats: () => API.get('/api/admin/stats/items'),
  exportItemStats: () => API.get('/api/admin/stats/items/export', { responseType: 'blob' }),

  // Event PDF
  getEventPDF: (eventId) => API.get(`/api/admin/events/pdf/${eventId}`, { responseType: 'blob' }),
  getEventItemsPDF: (eventId) => API.get(`/api/admin/events/${eventId}/items/pdf`, { responseType: 'blob' }),
  getEventsSummaryPDF: () => API.get('/api/admin/events/pdf-report', { responseType: 'blob' }),
  getEventSummaryReport: (type) =>
    API.get(`/api/admin/reports/events-summary/${type}`, { responseType: 'blob' }),
  getRolePdf: (role) => API.get(`/api/admin/pdf/roles/${encodeURIComponent(role)}`, { responseType: 'blob' }),
  getRequestedEvents: () =>
    API.get('/api/admin/requested-events'),

  giveEditAccess: (id, access) =>
    API.post(`/api/admin/give-edit-access/${id}`, { access }),

  deleteEvent: (eventId) => API.get(`/api/admin/delete/event/${eventId}`),
};

export default API;
