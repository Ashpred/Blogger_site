import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton; 