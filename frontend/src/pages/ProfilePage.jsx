import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import '../assets/styles/ProfilePage.css';

const BlogCard = ({ blog }) => {
  // Create excerpt from content
  const createExcerpt = (content) => {
    // Remove any HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-card">
      <div className="blog-image">
        <img src={blog.coverImage || '/default-blog.jpg'} alt={blog.title} />
      </div>
      <div className="blog-content">
        <h3>{blog.title}</h3>
        <p className="blog-excerpt">{createExcerpt(blog.content)}</p>
        <div className="blog-meta">
          <span className="blog-date">{formatDate(blog.createdAt)}</span>
          <div className="blog-stats">
            <span><i className="fas fa-heart"></i> {blog.likes?.length || 0}</span>
            <span><i className="fas fa-comment"></i> {blog.comments?.length || 0}</span>
            <span><i className="fas fa-share"></i> {blog.shares || 0}</span>
          </div>
        </div>
        <Link to={`/blog/${blog._id}`} className="read-more">Read More</Link>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get(`/api/users/${username}`);
        
        if (!userResponse.data.success) {
          throw new Error('Failed to fetch user profile');
        }
        
        const profileData = userResponse.data.data;
        setUserData(profileData);
        setSubscribersCount(profileData.subscribersCount || 0);
        
        // Check if it's the user's own profile
        if (user && user.username === username) {
          setIsOwnProfile(true);
        } else if (user && profileData.id) {
          // Check if current user is subscribed to this profile
          try {
            const subscriptionResponse = await axios.get(`/api/users/check-subscription/${profileData.id}`);
            if (subscriptionResponse.data.success) {
              setIsSubscribed(subscriptionResponse.data.isSubscribed);
            }
          } catch (err) {
            console.error('Failed to check subscription status:', err);
          }
        }
        
        // Fetch user's blogs
        const blogsResponse = await axios.get(`/api/users/${username}/blogs`);
        
        if (blogsResponse.data.success) {
          setUserBlogs(blogsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 404) {
          setError('Profile not found');
        } else {
          setError('An error occurred while fetching the profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, user, navigate]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!userData || !userData.id) {
      return;
    }

    setSubscribeLoading(true);
    try {
      const response = await axios.put(`/api/users/subscribe/${userData.id}`);
      
      if (response.data.success) {
        setIsSubscribed(response.data.isSubscribed);
        setSubscribersCount(response.data.subscribersCount);
        
        // Show toast notification
        const message = response.data.isSubscribed ? 
          `You are now following ${userData.fullName}` : 
          `You have unfollowed ${userData.fullName}`;
        // Add toast notification here if you have a toast system
      }
    } catch (error) {
      console.error('Error subscribing to user:', error);
      // Show error toast
    } finally {
      setSubscribeLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2>{error}</h2>
          <button onClick={() => navigate('/')} className="go-home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="profile-page"
    >
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-avatar">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt={userData.fullName}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>{getInitials(userData.fullName)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-info">
            <h1>{userData.fullName}</h1>
            <p className="username">@{userData.username}</p>
            
            {userData.bio && (
              <p className="bio">{userData.bio}</p>
            )}
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{userBlogs.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{subscribersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
            
            {isOwnProfile ? (
              <Link to="/settings" className="edit-profile-btn">
                <i className="fas fa-edit"></i> Edit Profile
              </Link>
            ) : (
              <button 
                className={`follow-btn ${isSubscribed ? 'following' : ''}`}
                onClick={handleSubscribe}
                disabled={subscribeLoading}
              >
                {subscribeLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <i className={`fas ${isSubscribed ? 'fa-user-check' : 'fa-user-plus'}`}></i>
                    {isSubscribed ? 'Following' : 'Follow'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            {isOwnProfile && (
              <>
                <button
                  className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('drafts')}
                >
                  Drafts
                </button>
                <button
                  className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved
                </button>
              </>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'posts' && (
              <div className="posts-container">
                {userBlogs.length > 0 ? (
                  userBlogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-feather-alt"></i>
                    </div>
                    <h3>No posts yet</h3>
                    <p>When {isOwnProfile ? 'you publish' : 'this user publishes'} articles, they'll appear here.</p>
                    {isOwnProfile && (
                      <Link to="/create-blog" className="create-blog-btn">
                        Create Your First Blog
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'drafts' && isOwnProfile && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3>No drafts yet</h3>
                <p>Your draft articles will appear here for you to continue working on them.</p>
                <Link to="/create-blog" className="create-blog-btn">
                  Start Writing
                </Link>
              </div>
            )}
            
            {activeTab === 'saved' && isOwnProfile && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-bookmark"></i>
                </div>
                <h3>No saved posts</h3>
                <p>Articles you save will appear here for you to read later.</p>
                <Link to="/main" className="browse-blogs-btn">
                  Browse Blogs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 