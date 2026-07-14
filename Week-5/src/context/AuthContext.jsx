import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('techforge_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching current user profile via Axios:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data;
      
      localStorage.setItem('techforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleRegister = async (name, email, password, role, institutionName) => {
    setError(null);
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role, institutionName });
      const data = response.data;

      localStorage.setItem('techforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techforge_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
