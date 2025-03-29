import axios from 'axios';
import Cookies from 'js-cookie';

// Helper function to set auth headers
const setAuthHeaders = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize auth from cookies/localStorage
export const initializeAuth = async () => {
  const token = Cookies.get('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      // Optionally verify token with backend
      // await axios.get('/api/v1/auth/verify');
      
      setAuthHeaders(token);
      return { token, user: JSON.parse(user) };
    } catch (error) {
      clearAuth();
      throw error;
    }
  }
  return { token: null, user: null };
};

// Clear auth data
export const clearAuth = () => {
  Cookies.remove('token');
  localStorage.removeItem('user');
  setAuthHeaders(null);
};

// Set auth data
export const setAuth = (token, user) => {
  Cookies.set('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setAuthHeaders(token);
};