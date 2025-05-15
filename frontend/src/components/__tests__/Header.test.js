import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header Component', () => {
  test('renders the header with correct text', () => {
    render(<Header />);
    
    // Check if the app name is in the document
    const appNameElement = screen.getByText(/AI-Powered Notes App/i);
    expect(appNameElement).toBeInTheDocument();
    
    // Check if the welcome message is in the document
    const welcomeElement = screen.getByText(/Welcome to Your Smart Notes/i);
    expect(welcomeElement).toBeInTheDocument();
    
    // Check if the description is in the document
    const descriptionElement = screen.getByText(/Create, organize, and analyze your notes with AI-powered sentiment analysis/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});