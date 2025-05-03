import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'test_api_key'  // In a real app, this would be stored securely
  }
});

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