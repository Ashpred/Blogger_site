import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
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
            <span className="logo-text">BlogSphere</span>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <motion.button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          whileTap={{ scale: 0.9 }}
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </motion.button>

        {/* Desktop menu */}
        <div className="desktop-menu">
          <Link to="/about" className="navbar-link">About Us</Link>
          
          {user ? (
            <>
              <Link to="/main" className="navbar-link">Feed</Link>
              <Link to="/create-blog" className="navbar-link">Create</Link>
              <LogoutButton />
              <div className="profile-dropdown">
                <img 
                  src={user.profilePicture || "https://via.placeholder.com/40"} 
                  alt={user.fullName} 
                  className="profile-avatar" 
                />
                <div className="dropdown-content">
                  <Link to={`/profile/${user.username}`} className="dropdown-item">
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout-container">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
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
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-menu"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <Link to="/about" className="mobile-menu-item">About Us</Link>
              
              {user ? (
                <>
                  <Link to="/main" className="mobile-menu-item">Feed</Link>
                  <Link to="/create-blog" className="mobile-menu-item">Create Blog</Link>
                  <Link to={`/profile/${user.username}`} className="mobile-menu-item">Profile</Link>
                  <Link to="/settings" className="mobile-menu-item">Settings</Link>
                  <div className="mobile-menu-item logout-container">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/signin" className="mobile-signin">Sign In</Link>
                  <Link to="/signup" className="mobile-signup">Sign Up</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar; 