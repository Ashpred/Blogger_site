import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      // ... existing code ...
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... existing code ... */}
    </div>
  );
};

export default LoginPage; 