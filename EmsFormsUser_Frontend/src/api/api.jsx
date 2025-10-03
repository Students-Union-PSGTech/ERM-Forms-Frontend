import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  withCredentials: true, // include HTTP-only cookie
});

// Auth: association user login
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const getEventPDF = (eventId) =>
  API.get(`/api/events/pdf/${eventId}`, { responseType: 'blob' });

// Create a new event with FormData support for file uploads
export const createEvent = async (formData) => {
  try {
    const res = await API.post('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// List events for the logged-in association
export const listEvents = async () => {
  const res = await API.get('/api/events');
  console.log(res)
  return res.data;
};


// Get a single event by id
export const getEvent = (id) => API.get(`/api/events/${id}`);

export const getItems = () => API.get('/api/items');

// Update an existing event by id
export const updateEvent = (id, data) => API.put(`/api/events/${id}`, data);
export const requestEditAccess = (body) =>
  API.post('/api/events/request-edit', body);
export { API };