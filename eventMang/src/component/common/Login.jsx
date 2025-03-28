// components/LoginForm.jsx
import React, { useState } from 'react';
import { useLoginMutation } from '../api/authApi';
import { loginUser } from '../services/authService';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [login, { isLoading, error }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(credentials);
    if (!result.success) {
      // Handle error (already handled by RTK Query)
      return;
    }
    // Redirect or show success message
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      
      {error && <div className="error">{error.data?.message || 'Login failed'}</div>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;