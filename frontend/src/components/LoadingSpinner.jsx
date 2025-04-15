import React from 'react';
import { motion } from 'framer-motion';
import '../assets/styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-spinner"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: {
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          },
          scale: {
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }
        }}
      >
        <div className="spinner-circle"></div>
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="loading-text"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner; 