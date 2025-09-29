import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  withCredentials: true, // include HTTP-only cookie
});

// Auth: association user login
export const login = (credentials) => API.post('/api/auth/login', credentials);

// Create a new event (expects eventData, roundsData, eventDetailsData, itemsData, eventFormData)
export const createEvent = async (payload) => {
  const res = await API.post('/api/events', payload);
  return res.data;
};

// List events for the logged-in association
export const listEvents = async () => {
  const res = await API.get('/api/events');
  return res.data;
};

// Update an existing event by id
export const patchEvent = (id, data) => API.put(`/api/events/${id}`, data);

export default API;