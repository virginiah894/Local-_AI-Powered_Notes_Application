import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = ({ onLoginSuccess }) => {
  // Check if there's a username from a recent registration
  const lastUsername = localStorage.getItem('lastRegisteredUsername');
  
  const [username, setUsername] = useState(lastUsername || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get authentication context
  const { handleLoginSuccess: authLoginSuccess } = useAuth();
  
  // Clear the lastRegisteredUsername from localStorage after using it
  React.useEffect(() => {
    if (lastUsername) {
      localStorage.removeItem('lastRegisteredUsername');
    }
  }, [lastUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Attempting to login with username:', username);
      
      try {
        // Use the loginUser function from api.js
        const { loginUser } = await import('../services/api');
        await loginUser({ username, password });
        
        console.log('Login successful, received token');
        
        // Update auth context with user data
        await authLoginSuccess();
        
        console.log('Login successful, redirecting to notes page');
        
        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } catch (apiError) {
        console.error('API Error details:', apiError);
        
        if (apiError.message.includes('404')) {
          setError('Login endpoint not found. Please check server configuration.');
        } else if (apiError.message.includes('Failed to fetch')) {
          setError('Network error. Please check if the server is running and CORS is configured correctly.');
          console.error('This is likely a CORS issue. Check the browser console for more details.');
        } else if (apiError.message.includes('401') || apiError.message.includes('Unauthorized')) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError(apiError.message || 'Failed to login. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="note-form shadow-sm mb-4">
      <Card.Header as="h5" className="text-center bg-primary text-white">Login</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border-primary-subtle"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;