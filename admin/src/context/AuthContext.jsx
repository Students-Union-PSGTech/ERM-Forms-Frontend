import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [user, setUser]                       = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.checkStatus();
      // Expected shape: { success: true, user: { id, username, email, role } }
      const data = response.data;
      console.log('[AuthContext] /api/admin/status response:', data);

      if (data?.success === true && data?.user) {
        const apiUser = data.user;
        const role    = apiUser.role || 'member';
        console.log('[AuthContext] role from server:', role);
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        setUser({ id: apiUser.id, username: apiUser.username, email: apiUser.email, role });
      } else {
        console.warn('[AuthContext] Unexpected response shape:', data);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('role');
      }
    } catch (err) {
      console.error('[AuthContext] checkStatus failed:', err);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('role');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try   { await adminAPI.logout(); }
    catch (e) { console.error('Logout error:', e); }
    finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('role');
    }
  };

  const forgotPassword = async (email) => {
    try {
      await adminAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (data) => {
    try {
      await adminAPI.resetPassword(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Password reset failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, user,
      logout, forgotPassword, resetPassword,
      checkAuthStatus,
      // kept for legacy callers in login.jsx
      setIsAuthenticated, setIsLoading, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
