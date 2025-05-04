import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getCurrentUser, logoutUser } from '../services/api';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Checking if user is authenticated');
      if (isAuthenticated()) {
        console.log('AuthContext: Token found, attempting to load user data');
        try {
          const userData = await getCurrentUser();
          console.log('AuthContext: User data loaded successfully', userData);
          setCurrentUser(userData);
        } catch (err) {
          console.error('AuthContext: Error loading user:', err);
          setError('Failed to load user data');
          // If there's an error, clear the token
          logoutUser();
        }
      } else {
        console.log('AuthContext: No token found, user is not authenticated');
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Function to handle login success
  const handleLoginSuccess = async () => {
    console.log('AuthContext: handleLoginSuccess called');
    try {
      const userData = await getCurrentUser();
      console.log('AuthContext: User data after login:', userData);
      setCurrentUser(userData);
      setError(null);
      return true;
    } catch (err) {
      console.error('AuthContext: Error getting user after login:', err);
      setError('Failed to get user data after login');
      return false;
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log('AuthContext: Logging out user');
    logoutUser();
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    handleLoginSuccess,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;