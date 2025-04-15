import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/styles/Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`toast toast-${type}`}
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="toast-icon">
            <i className={`fas ${icons[type]}`}></i>
          </div>
          <div className="toast-message">{message}</div>
          <button className="toast-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 