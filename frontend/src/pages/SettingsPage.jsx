import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/styles/SettingsPage.css';
import { uploadProfilePicture } from '../utils/imageUpload';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const fileInputRef = useRef(null);
  
  // Avatar suggestions from internet
  const avatarSuggestions = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80'
  ];

  // Cover image options (for future use)
  const coverImageOptions = [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1669023271833-9f422e3330ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80'
  ];
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: 'John Doe',
    username: 'johndoe',
    bio: 'WebGL enthusiast and frontend developer passionate about creating immersive web experiences.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    twitter: '@johndoe',
    github: 'johndoe'
  });
  
  const [accountForm, setAccountForm] = useState({
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newFollower: true,
    newComment: true,
    newLike: false,
    newsletter: true,
    marketingEmails: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    activityVisibility: 'followers',
    allowTagging: true,
    showEmail: false,
    twoFactorAuth: false
  });
  
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
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show a loading state
        setSaving(true);
        
        // Upload to Cloudinary
        const imageUrl = await uploadProfilePicture(file);
        
        // Update profile with the new image URL
        setProfileImage(imageUrl);
        
        // Update user profile in the database
        // This would typically be done in the saveSettings function
        
        setSuccessMessage('Profile picture updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to upload image. Please try again.');
        setTimeout(() => setError(''), 3000);
      } finally {
        setSaving(false);
        setShowAvatarGallery(false);
      }
    }
  };
  
  const selectAvatar = (avatar) => {
    setProfileImage(avatar);
    setShowAvatarGallery(false);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const toggleAvatarGallery = () => {
    setShowAvatarGallery(!showAvatarGallery);
  };
  
  const saveSettings = async (formType) => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message based on form type
    const successMessages = {
      profile: 'Profile settings saved successfully!',
      account: 'Account settings updated successfully!',
      notifications: 'Notification preferences updated!',
      privacy: 'Privacy settings updated successfully!'
    };
    
    setSuccessMessage(successMessages[formType]);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    setSaving(false);
  };
  
  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion logic
      console.log('Account deletion requested');
    }
  };
  
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
            <button 
              className={activeTab === 'notifications' ? 'active' : ''} 
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button 
              className={activeTab === 'privacy' ? 'active' : ''} 
              onClick={() => setActiveTab('privacy')}
            >
              <i className="fas fa-lock"></i>
              Privacy
            </button>
          </nav>
          <div className="sidebar-footer">
            <Link to="/main" className="back-to-home">
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
        
        <div className="settings-content">
          {successMessage && (
            <motion.div 
              className="settings-success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <i className="fas fa-check-circle"></i>
              {successMessage}
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
                  <img src={profileImage} alt="Profile" />
                  <button className="edit-photo-button" onClick={triggerFileInput}>
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
                <div className="profile-image-info">
                  <h3>Profile Photo</h3>
                  <p>Upload a new photo or choose from our suggested avatars</p>
                  <div className="profile-image-actions">
                    <button className="secondary-button" onClick={triggerFileInput}>
                      Upload New Photo
                    </button>
                    <button className="secondary-button" onClick={toggleAvatarGallery}>
                      Choose Avatar
                    </button>
                  </div>
                  
                  {showAvatarGallery && (
                    <motion.div 
                      className="avatar-gallery"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4>Suggested Avatars</h4>
                      <div className="avatar-options">
                        {avatarSuggestions.map((avatar, index) => (
                          <div 
                            key={index} 
                            className={`avatar-option ${profileImage === avatar ? 'selected' : ''}`}
                            onClick={() => selectAvatar(avatar)}
                          >
                            <img src={avatar} alt={`Avatar option ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveSettings('profile'); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="4"
                  ></textarea>
                  <div className="character-count">
                    {profileForm.bio.length}/160 characters
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <h3 className="form-section-title">Social Profiles</h3>
                
                <div className="form-row">
                  <div className="form-group social-input">
                    <label htmlFor="twitter">
                      <i className="fab fa-twitter"></i> Twitter
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={profileForm.twitter}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="form-group social-input">
                    <label htmlFor="github">
                      <i className="fab fa-github"></i> GitHub
                    </label>
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={profileForm.github}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
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
                Manage your account details and password.
              </p>
              
              <div className="account-overview">
                <div className="account-overview-content">
                  <div className="account-overview-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h3>Account Overview</h3>
                    <p>Manage your account details and security.</p>
                    <div className="account-stats">
                      <div className="account-stat">
                        <span>Member since</span>
                        <strong>Jan 2023</strong>
                      </div>
                      <div className="account-stat">
                        <span>Last login</span>
                        <strong>Today</strong>
                      </div>
                      <div className="account-stat">
                        <span>Account type</span>
                        <strong>Free</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Account security" 
                  className="account-overview-image"
                />
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveSettings('account'); }}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={accountForm.email}
                    onChange={handleAccountChange}
                  />
                </div>
                
                <h3 className="form-section-title">Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={accountForm.currentPassword}
                    onChange={handleAccountChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={accountForm.newPassword}
                      onChange={handleAccountChange}
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
                    />
                  </div>
                </div>
                
                <div className="password-requirements">
                  <p>Password must:</p>
                  <ul>
                    <li className={accountForm.newPassword.length >= 8 ? 'valid' : ''}>
                      <i className={accountForm.newPassword.length >= 8 ? 'fas fa-check' : 'fas fa-times'}></i>
                      Be at least 8 characters long
                    </li>
                    <li className={/[A-Z]/.test(accountForm.newPassword) ? 'valid' : ''}>
                      <i className={/[A-Z]/.test(accountForm.newPassword) ? 'fas fa-check' : 'fas fa-times'}></i>
                      Include at least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(accountForm.newPassword) ? 'valid' : ''}>
                      <i className={/[0-9]/.test(accountForm.newPassword) ? 'fas fa-check' : 'fas fa-times'}></i>
                      Include at least one number
                    </li>
                  </ul>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      'Update Account'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="danger-zone">
                <div className="danger-zone-header">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h3>Danger Zone</h3>
                </div>
                <p>
                  Once you delete your account, all of your content and data will be permanently removed.
                  This action cannot be undone.
                </p>
                <button type="button" className="danger-button" onClick={deleteAccount}>
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'notifications' && (
            <motion.div 
              className="settings-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Notification Settings</h2>
              <p className="section-description">
                Choose what notifications you receive and how you receive them.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); saveSettings('notifications'); }}>
                <div className="toggle-section">
                  <div className="toggle-header">
                    <h3>Email Notifications</h3>
                    <div className="toggle-switch-container">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="toggle-description">
                    Master control for all email notifications
                  </p>
                </div>
                
                <div className="notification-group">
                  <h3 className="form-section-title">Social Notifications</h3>
                  
                  <div className="notification-option">
                    <div className="notification-option-content">
                      <div className="notification-icon">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="notification-info">
                        <h4>New Follower</h4>
                        <p>Get notified when someone follows you</p>
                      </div>
                    </div>
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newFollower"
                          checked={notificationSettings.newFollower}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-option">
                    <div className="notification-option-content">
                      <div className="notification-icon">
                        <i className="fas fa-comment"></i>
                      </div>
                      <div className="notification-info">
                        <h4>Comments</h4>
                        <p>Get notified when someone comments on your post</p>
                      </div>
                    </div>
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newComment"
                          checked={notificationSettings.newComment}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-option">
                    <div className="notification-option-content">
                      <div className="notification-icon">
                        <i className="fas fa-heart"></i>
                      </div>
                      <div className="notification-info">
                        <h4>Post Likes</h4>
                        <p>Get notified when someone likes your post</p>
                      </div>
                    </div>
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newLike"
                          checked={notificationSettings.newLike}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="notification-group">
                  <h3 className="form-section-title">Other Notifications</h3>
                  
                  <div className="notification-option">
                    <div className="notification-option-content">
                      <div className="notification-icon">
                        <i className="fas fa-newspaper"></i>
                      </div>
                      <div className="notification-info">
                        <h4>Newsletter</h4>
                        <p>Weekly digest of new content and features</p>
                      </div>
                    </div>
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={notificationSettings.newsletter}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-option">
                    <div className="notification-option-content">
                      <div className="notification-icon">
                        <i className="fas fa-bullhorn"></i>
                      </div>
                      <div className="notification-info">
                        <h4>Marketing Emails</h4>
                        <p>Promotional emails and special offers</p>
                      </div>
                    </div>
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="marketingEmails"
                          checked={notificationSettings.marketingEmails}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'privacy' && (
            <motion.div 
              className="settings-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Privacy & Security</h2>
              <p className="section-description">
                Control your privacy settings and account security.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); saveSettings('privacy'); }}>
                <div className="privacy-hero">
                  <img 
                    src="https://images.unsplash.com/photo-1564398893304-820a5b058e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                    alt="Privacy Hero" 
                    className="privacy-hero-image"
                  />
                  <div className="privacy-hero-content">
                    <h3>Your Privacy Matters</h3>
                    <p>We're committed to protecting your personal information and providing you with control over your data.</p>
                  </div>
                </div>
                
                <div className="form-section-title">
                  <h3>Profile Visibility</h3>
                  <p>Control who can see your profile and content</p>
                </div>
                
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      checked={privacySettings.profileVisibility === 'public'}
                      onChange={handlePrivacyChange}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <h4>Public</h4>
                        <i className="fas fa-globe"></i>
                      </div>
                      <p>Anyone can view your profile and posts</p>
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
                        alt="Public profile illustration"
                        className="privacy-option-image"
                      />
                    </div>
                  </label>
                  
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="followers"
                      checked={privacySettings.profileVisibility === 'followers'}
                      onChange={handlePrivacyChange}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <h4>Followers Only</h4>
                        <i className="fas fa-user-friends"></i>
                      </div>
                      <p>Only people who follow you can see your posts</p>
                      <img 
                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80" 
                        alt="Followers only illustration"
                        className="privacy-option-image"
                      />
                    </div>
                  </label>
                  
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="private"
                      checked={privacySettings.profileVisibility === 'private'}
                      onChange={handlePrivacyChange}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <h4>Private</h4>
                        <i className="fas fa-lock"></i>
                      </div>
                      <p>You must approve follower requests. Only approved followers can see your posts</p>
                      <img 
                        src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80" 
                        alt="Private profile illustration"
                        className="privacy-option-image"
                      />
                    </div>
                  </label>
                </div>
                
                <div className="form-section-title">
                  <h3>Activity Status</h3>
                  <p>Choose who can see your activity status</p>
                </div>
                
                <div className="select-group">
                  <select
                    name="activityVisibility"
                    value={privacySettings.activityVisibility}
                    onChange={handlePrivacyChange}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers only</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
                
                <div className="toggle-section">
                  <div className="toggle-header">
                    <h3>Tagging</h3>
                    <div className="toggle-switch-container">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="allowTagging"
                          checked={privacySettings.allowTagging}
                          onChange={handlePrivacyChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="toggle-description">
                    Allow others to tag you in their posts
                  </p>
                </div>
                
                <div className="toggle-section">
                  <div className="toggle-header">
                    <h3>Show Email</h3>
                    <div className="toggle-switch-container">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="showEmail"
                          checked={privacySettings.showEmail}
                          onChange={handlePrivacyChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="toggle-description">
                    Display your email address on your public profile
                  </p>
                </div>
                
                <div className="form-section-title">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                
                <div className="toggle-section two-factor-section">
                  <div className="toggle-header">
                    <h3>Enable Two-Factor Authentication</h3>
                    <div className="toggle-switch-container">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={privacySettings.twoFactorAuth}
                          onChange={handlePrivacyChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="toggle-description">
                    You'll be asked for a verification code when you sign in on a new device
                  </p>
                  {privacySettings.twoFactorAuth && (
                    <button type="button" className="secondary-button setup-2fa-button">
                      Set Up Two-Factor Authentication
                    </button>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Privacy Settings'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 