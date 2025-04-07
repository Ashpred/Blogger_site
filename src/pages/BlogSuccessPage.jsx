import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/styles/BlogSuccessPage.css';

const BlogSuccessPage = () => {
  const navigate = useNavigate();
  
  // Redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="blog-success-page">
      <motion.div 
        className="success-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          type: 'spring',
          stiffness: 100 
        }}
      >
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Blog Post Published Successfully!</h1>
        <p>Your blog post has been published and is now live. Thank you for sharing your thoughts!</p>
        
        <div className="success-actions">
          <Link to="/" className="primary-button">
            <i className="fas fa-home"></i>
            Go to Home
          </Link>
          <Link to="/profile" className="secondary-button">
            <i className="fas fa-user"></i>
            View Profile
          </Link>
        </div>
        
        <div className="redirect-message">
          <div className="timer-spinner"></div>
          <p>You will be redirected to home page in 5 seconds...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogSuccessPage; 