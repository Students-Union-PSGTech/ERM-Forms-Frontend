import React, { createContext, useState, useContext, useEffect } from "react";
import { API, login as apiLogin } from "../api/api";
import { setSessionActive, clearSession, isActiveSession } from "../utils/sessionManager";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication on mount and tab/window focus
  useEffect(() => {
    const checkAuthStatus = async () => {
      // If this is a new tab, don't check auth status
      if (!isActiveSession()) {
        setIsAuthenticated(false);
        setUser(null);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }

      try {
        setLoading(true);
        const response = await API.get("/api/auth/status");
        
        if (response.status === 200 && response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          throw new Error('Session expired');
        }
      } catch (err) {
        console.log("Auth check failed:", err);
        clearSession();
        setIsAuthenticated(false);
        setUser(null);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    // Check auth status immediately
    checkAuthStatus();

    // Also check when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      console.log('Attempting login with:', { username });
      const response = await apiLogin({ username, password });
      console.log('Login response:', response);
      
      // Accept any successful response with data
      if (response.status === 200 && response.data) {
        console.log('Login successful:', response.data);
        setSessionActive(); // Mark this tab as having an active session
        setIsAuthenticated(true);
        setUser(response.data);
        return true;
      }
      
      console.log('Login failed: Invalid response format');
      throw new Error("Invalid credentials");
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid username or password";
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      clearSession(); // Clear any existing session
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await API.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearSession();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      // Force redirect to login page
      window.location.href = '/login';
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
