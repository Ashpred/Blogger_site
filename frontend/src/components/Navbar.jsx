import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/styles/Navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100,
        delay: 0.1
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: '0px 0px 8px rgba(255,255,255,0.3)',
      transition: { type: 'spring', stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div 
            className="logo-container"
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            BlogSphere
          </motion.div>
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/about" className="navbar-link">About Us</Link>
              <Link to="/signin">
                <motion.button 
                  className="signin-button"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Sign In
                </motion.button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/about" className="navbar-link">About Us</Link>
              <Link to="/create-blog" className="navbar-link">Create Blog</Link>
              <Link to="/main" className="navbar-link">Feed</Link>
              <Link to={`/profile/${localStorage.getItem('username')}`} className="navbar-link">Profile</Link>
              <Link to="/settings" className="navbar-link">Settings</Link>
              <motion.button 
                className="logout-button"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 