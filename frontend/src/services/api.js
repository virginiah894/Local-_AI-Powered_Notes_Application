import axios from 'axios';

// Use direct URL to the backend
const API_URL = 'http://localhost:8001';

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
    console.log('API: Fetching notes');
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } catch (jsonError) {
        // If the response is not valid JSON
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response format from server');
    }
    console.log('API: Notes fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note) => {
  try {
    console.log('API: Creating note:', note);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(note),
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } catch (jsonError) {
        // If the response is not valid JSON
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response format from server');
    }
    console.log('API: Note created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Analyze note sentiment
export const analyzeNote = async (noteId) => {
  try {
    console.log('API: Analyzing note sentiment for ID:', noteId);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/notes/${noteId}/analyze`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } catch (jsonError) {
        // If the response is not valid JSON
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response format from server');
    }
    console.log('API: Note sentiment analyzed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing note:', error);
    throw error;
  }
};

// Authentication API calls
export const registerUser = async (userData) => {
  try {
    console.log('API: Registering user with data:', { ...userData, password: '[REDACTED]' });
    console.log('API: Full request URL:', `${API_URL}/users/register`);
    
    // Log request headers for debugging
    const headers = {
      'Content-Type': 'application/json'
    };
    console.log('API: Request headers:', headers);
    
    // Make the request with explicit URL and headers for debugging
    const response = await axios({
      method: 'post',
      url: `${API_URL}/users/register`,
      headers: headers,
      data: userData
    });
    
    console.log('API: Registration successful, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error registering user:', error);
    console.error('API: Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
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