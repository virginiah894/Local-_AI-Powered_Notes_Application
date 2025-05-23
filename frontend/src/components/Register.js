import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Attempting to register user with data:', { username, email, password: '***' });
      
      try {
        // Use direct URL to the backend
        const response = await fetch('http://localhost:8001/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
          mode: 'cors', // Explicitly set CORS mode
          credentials: 'same-origin'
        });
        
        // Even if the response is not OK (e.g., 400 error), we'll try to handle it gracefully
        // This is especially useful for cases where the user already exists
        if (!response.ok) {
          try {
            const errorData = await response.json();
            
            // If the error is about the user already existing, we'll redirect to login
            if (response.status === 400 &&
                (errorData.detail?.includes('already exists') ||
                 errorData.detail?.includes('already registered'))) {
              console.log('User already exists, redirecting to login');
              alert('This username or email is already registered. Redirecting to login page.');
              
              // Call the onRegisterSuccess callback to switch to login tab
              if (onRegisterSuccess) {
                onRegisterSuccess(username);
              }
              return;
            } else {
              throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
          } catch (jsonError) {
            // If the response is not valid JSON
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid response format from server');
        }
        console.log('Registration successful:', result);
        
        // Show success message before redirecting
        setError('');
        alert('Registration successful! Please log in with your credentials.');
        
        // Call the onRegisterSuccess callback if provided
        if (onRegisterSuccess) {
          console.log('Calling onRegisterSuccess callback');
          onRegisterSuccess();
        }
      } catch (apiError) {
        console.error('API Error details:', apiError);
        
        if (apiError.message.includes('404')) {
          setError('Registration endpoint not found. Please check server configuration.');
        } else if (apiError.message.includes('Failed to fetch')) {
          setError('Network error. Please check if the server is running and CORS is configured correctly.');
          console.error('This is likely a CORS issue. Check the browser console for more details.');
        } else {
          setError(apiError.message || 'Failed to register. Please try again.');
        }
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="note-form shadow-sm mb-4">
      <Card.Header as="h5" className="text-center bg-primary text-white">Register</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="border-primary-subtle"
            />
            <Form.Text className="text-muted">
              Username must be at least 3 characters long.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-primary-subtle"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border-primary-subtle"
            />
            <Form.Text className="text-muted">
              Password must be at least 8 characters long.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-primary-subtle"
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;