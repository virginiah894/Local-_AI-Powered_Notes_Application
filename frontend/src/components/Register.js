import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { registerUser } from '../services/api';

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
        // Use direct fetch instead of the API service to debug
        const response = await fetch('http://localhost:8001/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
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
    <Card className="mb-4">
      <Card.Header as="h5">Register</Card.Header>
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
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;