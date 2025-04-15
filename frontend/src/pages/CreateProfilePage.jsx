import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import Navbar from '../components/Navbar';
import '../assets/styles/AuthPages.css';

const CreateProfilePage = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    bio: '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      setFormData({
        ...formData,
        profilePicture: file
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let profileImageUrl = null;

      // Upload profile picture if one was selected
      if (formData.profilePicture) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.profilePicture);
        
        const uploadResponse = await axios.post('/api/upload/profile', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadResponse.data.success) {
          profileImageUrl = uploadResponse.data.imageUrl;
        } else {
          throw new Error('Failed to upload profile picture');
        }
      }
      
      // Update user profile with bio and profile picture URL
      const updateData = {
        bio: formData.bio
      };
      
      if (profileImageUrl) {
        updateData.profilePicture = profileImageUrl;
      }
      
      const updateResponse = await axios.put('/api/users/profile', updateData);
      
      if (updateResponse.data.success) {
        // Update local user data with new profile info
        const updatedUser = {
          ...user,
          bio: formData.bio,
          profilePicture: profileImageUrl || user.profilePicture
        };
        
        // Update user in auth context
        login(updatedUser);
        
        // Reset new user status
        if (onComplete) onComplete();
        
        showToast('Profile created successfully!', 'success');
        navigate('/main');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create profile. Please try again.');
      showToast('Failed to create profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const skipProfileSetup = () => {
    // Reset new user status
    if (onComplete) onComplete();
    showToast('You can complete your profile later from settings', 'info');
    navigate('/main');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
      <Navbar isAuthenticated={true} />
      
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          variants={formVariants}
        >
          <div className="auth-header">
            <h2>Create Your Profile</h2>
            <p>Set up your profile to start using the platform</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="profile-pic-container">
              <div className="profile-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" />
                ) : (
                  <div className="profile-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              
              <label onClick={triggerFileInput} className="upload-btn">
                Upload Profile Picture
              </label>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself"
                rows={4}
                maxLength={500}
              ></textarea>
              <small className="char-count">{formData.bio.length}/500 characters</small>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Saving...</span>
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
            
            <div className="skip-option">
              <button 
                type="button" 
                className="skip-button"
                onClick={skipProfileSetup}
                disabled={loading}
              >
                Skip for now
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateProfilePage; 