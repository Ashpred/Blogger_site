import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../assets/styles/AuthPages.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Password validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful registration
      console.log('Registration attempt with:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store mock authentication data
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('username', formData.username);
      
      // Redirect to create profile page
      navigate('/create-profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setSocialLoading(provider);
    setError(null);
    
    try {
      console.log(`Initiating ${provider} sign up...`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Redirect to OAuth provider (Google, Facebook, etc.)
      // 2. Handle the OAuth callback with your backend
      // 3. Create an account if first time user
      
      // For now, we'll simulate a successful registration
      const userData = {
        google: { name: 'Google User', email: 'google.user@example.com' },
        facebook: { name: 'Facebook User', email: 'facebook.user@example.com' },
        github: { name: 'GitHub User', email: 'github.user@example.com' }
      };
      
      console.log(`Successful ${provider} sign up:`, userData[provider]);
      
      // Redirect to create profile page for social signups as well
      navigate('/create-profile', { state: { email: userData[provider].email, provider } });
    } catch (err) {
      setError(`${provider} sign up failed. Please try again.`);
    } finally {
      setSocialLoading('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="auth-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Navbar />
      
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          variants={formVariants}
        >
          <div className="auth-header">
            <h2>Create an Account</h2>
            <p>Join our community and start sharing your stories</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="form-group-remember">
              <div className="remember-me">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link></label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : 'Sign Up'}
            </button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="social-signin">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialSignUp('google')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'google' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-google"></i>
                    Sign up with Google
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => handleSocialSignUp('facebook')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'facebook' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-facebook-f"></i>
                    Sign up with Facebook
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button github"
                onClick={() => handleSocialSignUp('github')}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'github' ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-github"></i>
                    Sign up with GitHub
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUpPage; 