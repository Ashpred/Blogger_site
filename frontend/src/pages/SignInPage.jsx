import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/AuthPages.css';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Memoize the background image URL to prevent unnecessary re-renders
  const backgroundStyle = useMemo(() => ({
    backgroundImage: 'url("https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }), []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
        
        login(response.data.user);
        navigate('/main');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={backgroundStyle}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 style={{ fontFamily: 'Uber Move, sans-serif' }}>Sign In</h2>
            <p style={{ fontFamily: 'Uber Move, sans-serif' }}>Welcome back! Please sign in to your account</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" style={{ fontFamily: 'Uber Move, sans-serif' }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ fontFamily: 'Uber Move, sans-serif' }}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" style={{ fontFamily: 'Uber Move, sans-serif' }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ fontFamily: 'Uber Move, sans-serif' }}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading} 
              style={{ fontFamily: 'Uber Move, sans-serif' }}
              aria-label={loading ? "Signing in..." : "Sign In"}
            >
              {loading ? (
                <>
                  <span className="spinner-small" aria-hidden="true"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="auth-footer" style={{ fontFamily: 'Uber Move, sans-serif' }}>
            Don't have an account? <Link to="/signup" aria-label="Navigate to Sign Up page">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SignInPage); 