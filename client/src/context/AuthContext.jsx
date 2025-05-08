import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

// Key for storing the token in localStorage
const AUTH_TOKEN_KEY = 'authToken';

export const AuthProvider = ({ children }) => {
  // Initialize state based on localStorage
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(AUTH_TOKEN_KEY));
  // Initialize with admin role for development purposes
  const [user, setUser] = useState(() => (
    localStorage.getItem(AUTH_TOKEN_KEY) 
      ? { username: 'admin', role: 'ADMIN' } 
      : null
  ));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to update localStorage when authToken changes
  // This might be redundant if we only set localStorage in login/logout,
  // but ensures consistency if the token were updated elsewhere.
  useEffect(() => {
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [authToken]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("AuthContext: Attempting login for", username);
    try {
      const loggedInUser = await authService.login(username, password);
      // Add role to the user object - assuming 'ADMIN' for now
      loggedInUser.role = 'ADMIN';

      const token = authService.createBasicAuthToken(username, password);
      setIsAuthenticated(true);
      setUser(loggedInUser);
      setAuthToken(token);
      localStorage.setItem(AUTH_TOKEN_KEY, token); // Store token in localStorage
      setLoading(false);
      console.log("AuthContext: Login successful, token set. User:", loggedInUser);
      return true; // Indicate success

    } catch (error) {
      console.error("AuthContext: Login failed", error);
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
      setError(error.message || 'Login failed'); // Store the error message
      setLoading(false);
      return false; // Indicate failure
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out");
    authService.logout(); // Perform service-level logout actions if any
    setIsAuthenticated(false);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY); // Remove token from localStorage
    setError(null);
  };

  // Extract userRole for easier access
  const userRole = user?.role;

  // TODO: Add function to update user profile (password change)

  const value = {
    isAuthenticated,
    user,
    userRole,  // Add userRole to context value
    authToken,
    loading,
    error,
    login,
    logout,
  };

  console.log("AuthContext: Current context values:", { isAuthenticated, userRole });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
