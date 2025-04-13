import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Optimize background image loading
  const backgroundStyle = useMemo(() => ({
    backgroundImage: 'url("https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  }), []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await axios.post('/api/auth/register', registrationData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
        
        login(response.data.user);
        navigate('/main');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }, [formData, login, navigate]);

  // Memoize form elements to prevent unnecessary re-renders
  const renderFormGroup = useCallback((id, label, type = 'text', autoComplete) => (
    <div className="form-group">
      <label htmlFor={id} style={{ fontFamily: 'Uber Move, sans-serif' }}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        required
        style={{ fontFamily: 'Uber Move, sans-serif' }}
        autoComplete={autoComplete}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  ), [formData, handleChange]);

  return (
    <>
      <div style={backgroundStyle} />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2 style={{ fontFamily: 'Uber Move, sans-serif' }}>Sign Up</h2>
              <p style={{ fontFamily: 'Uber Move, sans-serif' }}>Create your account to get started</p>
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              {renderFormGroup('fullName', 'Full Name', 'text', 'name')}
              {renderFormGroup('username', 'Username', 'text', 'username')}
              {renderFormGroup('email', 'Email', 'email', 'email')}
              {renderFormGroup('password', 'Password', 'password', 'new-password')}
              {renderFormGroup('confirmPassword', 'Confirm Password', 'password', 'new-password')}
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading} 
                style={{ fontFamily: 'Uber Move, sans-serif' }}
                aria-label={loading ? "Signing up..." : "Sign Up"}
              >
                {loading ? (
                  <>
                    <span className="spinner-small" aria-hidden="true"></span>
                    <span>Signing up...</span>
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
            
            <div className="auth-footer" style={{ fontFamily: 'Uber Move, sans-serif' }}>
              Already have an account? <Link to="/signin" aria-label="Navigate to Sign In page">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(SignUpPage); 