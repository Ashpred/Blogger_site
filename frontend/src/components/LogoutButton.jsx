import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../assets/styles/LogoutButton.css';

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      showToast('Successfully logged out', 'success');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to log out. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="logout-button"
      onClick={handleLogout}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? (
        <div className="logout-spinner"></div>
      ) : (
        <>
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </>
      )}
    </motion.button>
  );
};

export default LogoutButton; 