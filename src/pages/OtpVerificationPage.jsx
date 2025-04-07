import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../assets/styles/AuthPages.css';

const OtpVerificationPage = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const provider = location.state?.provider || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
    
    // Auto-fill OTP for social logins to simplify the demo
    if (provider) {
      // Simulate auto-verification for social logins
      setOtp(['1', '2', '3', '4', '5', '6']);
    }
  }, [email, navigate, provider]);

  // Set up countdown timer
  useEffect(() => {
    let interval = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Set focus to the last input
      inputRefs.current[5].focus();
    }
  };

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would make an API call to resend OTP
      // For now, we'll simulate a successful resend
      console.log('Resending OTP to:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset timer and OTP fields
      setTimer(60);
      setCanResend(false);
      resetOtp();
      
      // Show success message
      setSuccess('A new verification code has been sent to your email.');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    // Check if OTP is complete
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete verification code.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would make an API call to verify OTP
      // For now, we'll simulate a successful verification
      console.log('Verifying OTP:', otp.join(''), 'for email:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Upon successful verification, navigate to create profile page
      // and set the user as authenticated
      if (setIsAuthenticated) {
        localStorage.setItem('token', provider ? `mock-jwt-token-${provider}` : 'mock-jwt-token');
        localStorage.setItem('username', provider ? `${provider}User` : 'testuser');
        if (provider) {
          localStorage.setItem('provider', provider);
        }
        setIsAuthenticated(true);
      }
      
      navigate('/create-profile');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      resetOtp();
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify for social logins after a short delay
  useEffect(() => {
    if (provider && otp.every(digit => digit) && !loading) {
      const timer = setTimeout(() => {
        handleVerify();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [otp, provider, loading]);

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
            <h2>
              {provider ? (
                <>
                  <i className={`fab fa-${provider} social-icon`}></i>
                  Verify Your {provider.charAt(0).toUpperCase() + provider.slice(1)} Account
                </>
              ) : (
                'Verify Your Email'
              )}
            </h2>
            <p>
              {provider ? (
                <>We're verifying your {provider} account <strong>{email}</strong></>
              ) : (
                <>We've sent a verification code to <strong>{email}</strong></>
              )}
            </p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          
          {provider && (
            <div className="auth-success social-auth-message">
              <i className="fas fa-spinner fa-spin"></i>
              Automatically verifying your {provider} account...
            </div>
          )}
          
          <div className="auth-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : null}
                  className={`otp-input ${provider ? 'social-otp' : ''}`}
                  autoFocus={index === 0 && !provider}
                  readOnly={provider}
                />
              ))}
            </div>
            
            <button 
              onClick={handleVerify}
              className="auth-button"
              disabled={loading || otp.some(digit => !digit)}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
            
            {!provider && (
              <div className="resend-timer">
                {canResend ? (
                  <button 
                    onClick={handleResendOtp}
                    className="resend-button"
                    disabled={loading}
                  >
                    Resend Verification Code
                  </button>
                ) : (
                  <p>Resend code in {timer} seconds</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OtpVerificationPage; 