import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      // Call the logout function from context
      logout();
      
      // Force navigation to login page
      navigate('/signin', { replace: true });
      
      // Add a small delay and then reload the page to ensure everything is reset
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
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