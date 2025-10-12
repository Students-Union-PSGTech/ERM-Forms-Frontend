import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.checkStatus();
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser({ role: 'admin' }); // You can modify this based on your needs
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    try {
      // Call the backend logout endpoint to clear cookies/session
      await adminAPI.logout();
    } catch (error) {
      // Even if API call fails, we still clear local state
      console.error('Logout API error:', error);
    } finally {
      // Always clear local authentication state
      localStorage.removeItem('role');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const forgotPassword = async () => {
    try {
      const response = await adminAPI.forgotPassword();
      if (response.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send OTP' 
      };
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await adminAPI.resetPassword(data);
      if (response.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset failed' 
      };
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    logout,
    forgotPassword,
    resetPassword,
    checkAuthStatus,
    setIsAuthenticated,
    setIsLoading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
