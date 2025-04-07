import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../assets/styles/AuthPages.css';

const SignInPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful login
      console.log('Login attempt with:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('username', 'testuser');
      
      setIsAuthenticated(true);
      navigate('/main');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    setError(null);
    
    try {
      console.log(`Initiating ${provider} login...`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Redirect to OAuth provider (Google, Facebook, etc.)
      // 2. Handle the OAuth callback with your backend
      
      // For now, we'll simulate a successful login
      const userData = {
        google: { name: 'Google User', email: 'google.user@example.com' },
        facebook: { name: 'Facebook User', email: 'facebook.user@example.com' },
        github: { name: 'GitHub User', email: 'github.user@example.com' }
      };
      
      console.log(`Successful ${provider} login:`, userData[provider]);
      
      localStorage.setItem('token', `mock-jwt-token-${provider}`);
      localStorage.setItem('username', userData[provider].name);
      localStorage.setItem('provider', provider);
      
      setIsAuthenticated(true);
      navigate('/main');
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
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
            <h2>Welcome Back!</h2>
            <p>Sign in to continue to your account</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
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
            
            <div className="form-group-remember">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="social-signin">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialLogin('google')}
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
                    Sign in with Google
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => handleSocialLogin('facebook')}
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
                    Sign in with Facebook
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button github"
                onClick={() => handleSocialLogin('github')}
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
                    Sign in with GitHub
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignInPage; 