import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fetch all notes
export const fetchNotes = async () => {
  try {
    const response = await api.get('/notes');
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note) => {
  try {
    const response = await api.post('/notes', note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Analyze note sentiment
export const analyzeNote = async (noteId) => {
  try {
    const response = await api.get(`/notes/${noteId}/analyze`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing note:', error);
    throw error;
  }
};

// Authentication API calls
export const registerUser = async (userData) => {
  try {
    console.log('API: Registering user with data:', { ...userData, password: '[REDACTED]' });
    const response = await api.post('/users/register', userData);
    console.log('API: Registration successful, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error registering user:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log('API: Logging in user:', credentials.username);
    const response = await api.post('/users/login', credentials);
    console.log('API: Login successful, received token');
    // Store the token in localStorage
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('API: Error logging in:', error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  try {
    console.log('API: Getting current user data');
    const response = await api.get('/users/me');
    console.log('API: Current user data retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error getting current user:', error.response?.data || error.message);
    throw error;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};