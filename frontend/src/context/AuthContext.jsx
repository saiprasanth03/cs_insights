import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const USER_CACHE_KEY = 'cs_insights_user';

export const AuthProvider = ({ children }) => {
  // Load cached user instantly so buttons don't flicker as disabled on page load
  const cachedUser = (() => {
    try { return JSON.parse(localStorage.getItem(USER_CACHE_KEY)); } catch { return null; }
  })();

  const [user, setUser] = useState(cachedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cachedUser);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data && data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
          // Update cache with fresh data
          localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.data));
        } else {
          // Cookie expired or invalid - clear cache
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem(USER_CACHE_KEY);
        }
      } catch (error) {
        // Not authenticated - clear cache
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(USER_CACHE_KEY);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data && data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.data));
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data && data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.data));
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(USER_CACHE_KEY);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
