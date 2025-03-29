import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { initializeAuth, setAuth, clearAuth } from '../services/auth';
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isLoading: true
  });
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user } = await initializeAuth();
        setAuthState({ user, token, isLoading: false });
      } catch (error) {
        setAuthState({ user: null, token: null, isLoading: false });
      }
    };
    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      console.log("login auth contex called !!!!")
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/user/login`, { email, password });
      
      setAuth(data.token, data.user);
      setAuthState({ user: data.user, token: data.token, isLoading: false });
      console.log(JSON.stringify(data));
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/');
      
      return true;
    } catch (error) {
      console.log(error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { data } = await axios.post('/api/v1/user/signup', userData);
      
      setAuth(data.token, data.user);
      setAuthState({ user: data.user, token: data.token, isLoading: false });
      
      toast.success(`Welcome, ${data.user.firstName}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
      
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    clearAuth();
    setAuthState({ user: null, token: null, isLoading: false });
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Context value
  const value = {
    ...authState,
    login,
    register,
    logout,
    isAuthenticated: !!authState.token,
    hasRole: (role) => authState.user?.role === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);





// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

// // Create context
// export const AuthContext = createContext();

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Initialize auth state
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedToken = Cookies.get('token');
//       const storedUser = localStorage.getItem('user');

//       if (storedToken && storedUser) {
//         try {
//           // Verify token with backend if needed
//           // const { data } = await axios.get('/api/v1/user/verify');
          
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
//           axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//         } catch (error) {
//           logout();
//         }
//       }
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.post('http://localhost:8000/api/v1/user/login', {
//         email,
//         password
//       });

//       const { token, user } = data;
      
//       // Set token in cookies (expires in 1 day)
//       Cookies.set('token', token);
      
//       // Set user in local storage
//       localStorage.setItem('user', JSON.stringify(user));
      
//       // Set axios default headers
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       // Update state
//       setToken(token);
//       setUser(user);
      
//       // Show success message
//       toast.success(`Welcome back, ${user.firstName}!`);

//       // Redirect based on role
//       const redirectPath = user.role === 'admin' ? '/admin' : '/user';
//       navigate(redirectPath);

//       return true;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.post('http://localhost:8000/api/v1/user/signup', userData);
      
//       const { token, user } = data;
      
//       // Set token and user
//       Cookies.set('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       // Update state
//       setToken(token);
//       setUser(user);
      
//       // Show success message
//       toast.success(`Welcome, ${user.firstName}!`);

//       // Redirect based on role
//       const redirectPath = user.role === 'admin' ? '/admin' : '/user';
//       navigate(redirectPath);

//       return true;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     // Clear tokens and user data
//     Cookies.remove('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
    
//     // Reset state
//     setToken(null);
//     setUser(null);
    
//     // Redirect to login
//     navigate('/login');
    
//     // Show message
//     toast.success('Logged out successfully');
//   };

//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return !!token;
//   };

//   // Check if user has specific role
//   const hasRole = (role) => {
//     return user?.role === role;
//   };

//   // Context value
//   const value = {
//     user,
//     token,
//     isLoading,
//     login,
//     register,
//     logout,
//     isAuthenticated,
//     hasRole
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for easy access to auth context
// export const useAuth = () => {
//   return React.useContext(AuthContext);
// };