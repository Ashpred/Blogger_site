import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
            <img 
              src="https://img.freepik.com/premium-vector/blog-icon-flat-fill-set-collection_1223784-21660.jpg" 
              alt="Blog Icon" 
              className="blog-icon"
            />
            BlogSphere
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/about" className="navbar-link">About Us</Link>
          
          {user ? (
            <>
              <Link to="/main" className="navbar-link">Feed</Link>
              <Link to="/create-blog" className="navbar-link">Create Blog</Link>
              <Link to={`/profile/${user.username}`} className="navbar-link">Profile</Link>
              <Link to="/settings" className="navbar-link">Settings</Link>
              <LogoutButton />
            </>
          ) : (
            <>
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
              <Link to="/signup">
                <motion.button 
                  className="signin-button primary"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 