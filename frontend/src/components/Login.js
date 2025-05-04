import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get authentication context
  const { handleLoginSuccess: authLoginSuccess } = useAuth();

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
        // Use direct fetch instead of the API service to debug
        const response = await fetch('http://localhost:8001/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Login successful, received token');
        
        // Store the token in localStorage
        localStorage.setItem('token', result.access_token);
        
        // Update auth context with user data
        await authLoginSuccess();
        
        console.log('Login successful, redirecting to notes page');
        
        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } catch (apiError) {
        console.error('API Error details:', apiError);
        setError(apiError.message || 'Failed to login. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Login</Card.Header>
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
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;