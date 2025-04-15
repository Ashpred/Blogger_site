import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../assets/styles/SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    username: '',
    bio: ''
  });
  
  const [accountForm, setAccountForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileImage(user.profilePicture || null);
      setProfileForm({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || ''
      });
      setAccountForm({
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm({
      ...accountForm,
      [name]: value
    });
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        showToast('Please select an image file', 'error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      
      try {
        // Show a loading state
        setSaving(true);
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        // Upload to backend
        const uploadResponse = await axios.post('/api/upload/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (!uploadResponse.data.success) {
          throw new Error('Failed to upload image');
        }
        
        // Get the image URL from the response
        const imageUrl = uploadResponse.data.imageUrl;
        
        // Update profile with the new image URL
        const updateResponse = await axios.put('/api/users/profile', {
          profilePicture: imageUrl
        });
        
        if (!updateResponse.data.success) {
          throw new Error('Failed to update profile');
        }
        
        // Update local state and user context
        setProfileImage(imageUrl);
        login({
          ...user,
          profilePicture: imageUrl
        });
        
        showToast('Profile picture updated successfully!', 'success');
      } catch (error) {
        console.error('Image upload error:', error);
        setError('Failed to upload image. Please try again.');
        showToast('Failed to upload image. Please try again.', 'error');
      } finally {
        setSaving(false);
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const saveProfileSettings = async () => {
    setSaving(true);
    setError('');
    
    try {
      const response = await axios.put('/api/users/profile', {
        fullName: profileForm.fullName,
        bio: profileForm.bio
      });
      
      if (!response.data.success) {
        throw new Error('Failed to update profile');
      }
      
      // Update user in auth context
      login({
        ...user,
        fullName: profileForm.fullName,
        bio: profileForm.bio
      });
      
      showToast('Profile settings saved successfully!', 'success');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      showToast('Failed to update profile settings', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  const saveAccountSettings = async () => {
    setSaving(true);
    setError('');
    
    // Validate password fields
    if (accountForm.newPassword && !accountForm.currentPassword) {
      setError('Current password is required to set a new password');
      showToast('Current password is required', 'error');
      setSaving(false);
      return;
    }
    
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      setError('New passwords do not match');
      showToast('New passwords do not match', 'error');
      setSaving(false);
      return;
    }
    
    try {
      // Only update password if a new one is provided
      let requestData = {};
      
      if (accountForm.newPassword) {
        requestData = {
          currentPassword: accountForm.currentPassword,
          newPassword: accountForm.newPassword
        };
      }
      
      // Debug logs
      console.log('Sending password update request to:', '/api/users/change-password');
      console.log('Request data:', JSON.stringify(requestData));
      console.log('Auth token present:', localStorage.getItem('token') ? 'Yes' : 'No');
      
      const response = await axios.put('/api/users/change-password', requestData);
      
      console.log('Password update response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update password');
      }
      
      // Reset password fields
      setAccountForm({
        ...accountForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showToast('Password updated successfully!', 'success');
    } catch (err) {
      console.error('Account update error details:', err);
      console.error('Response:', err.response);
      setError(err.response?.data?.message || 'Failed to update account settings');
      showToast('Failed to update account settings', 'error');
    } finally {
    setSaving(false);
    }
  };
  
  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setSaving(true);
        
        const response = await axios.delete('/api/users/delete-account');
        
        if (!response.data.success) {
          throw new Error('Failed to delete account');
        }
        
        // Log out the user and redirect to home page
        logout();
        showToast('Your account has been successfully deleted', 'success');
        navigate('/');
      } catch (err) {
        console.error('Account deletion error:', err);
        setError(err.response?.data?.message || 'Failed to delete account');
        showToast('Failed to delete account', 'error');
      } finally {
        setSaving(false);
      }
    }
  };
  
  // If no user, redirect to login
  if (!user) {
    return <div className="settings-loading">Loading...</div>;
  }
  
  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-sidebar">
          <h2>Settings</h2>
          <nav className="settings-nav">
            <button 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile
            </button>
            <button 
              className={activeTab === 'account' ? 'active' : ''} 
              onClick={() => setActiveTab('account')}
            >
              <i className="fas fa-cog"></i>
              Account
            </button>
          </nav>
          <div className="sidebar-footer">
            <Link to="/main" className="back-to-home">
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
        
        <div className="settings-content">
          {error && (
            <motion.div 
              className="settings-error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div 
              className="settings-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Profile Settings</h2>
              <p className="section-description">
                Customize your profile information that will be displayed to other users.
              </p>
              
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  ) : (
                    <div className="profile-placeholder">
                      <span>{user.fullName ? user.fullName[0].toUpperCase() : 'U'}</span>
                    </div>
                  )}
                  <button 
                    className="edit-photo-button" 
                    onClick={triggerFileInput}
                    disabled={saving}
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden-input"
                  />
                </div>
                <p className="photo-tip">Click on the camera icon to change your profile picture</p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveProfileSettings(); }}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                    placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileForm.username}
                    disabled
                    className="disabled-input"
                    />
                  <small className="input-help-text">Username cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    rows="4"
                    maxLength="500"
                  ></textarea>
                  <small className="input-help-text">{profileForm.bio.length}/500 characters</small>
                </div>
                
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={saving}
                >
                    {saving ? (
                      <>
                      <span className="button-spinner"></span>
                        Saving...
                      </>
                  ) : 'Save Changes'}
                  </button>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'account' && (
            <motion.div 
              className="settings-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Account Settings</h2>
              <p className="section-description">
                Manage your account security and preferences.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); saveAccountSettings(); }}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={accountForm.email}
                    disabled
                    className="disabled-input"
                  />
                  <small className="input-help-text">Email cannot be changed</small>
                </div>
                
                <div className="form-divider"></div>
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={accountForm.currentPassword}
                    onChange={handleAccountChange}
                    placeholder="Enter your current password"
                  />
                </div>
                
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={accountForm.newPassword}
                      onChange={handleAccountChange}
                    placeholder="Enter your new password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={accountForm.confirmPassword}
                      onChange={handleAccountChange}
                    placeholder="Confirm your new password"
                    />
                </div>
                
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={saving || (
                    !accountForm.currentPassword && 
                    !accountForm.newPassword && 
                    !accountForm.confirmPassword
                  )}
                >
                    {saving ? (
                      <>
                      <span className="button-spinner"></span>
                        Saving...
                      </>
                  ) : 'Update Password'}
                  </button>
              </form>
              
              <div className="delete-account-section">
                  <h3>Danger Zone</h3>
                <p>
                  Permanently delete your account and all your data. This action cannot be undone.
                </p>
                <button 
                  className="delete-account-button" 
                  onClick={deleteAccount}
                  disabled={saving}
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 