import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await axios.get(`/api/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setError('Profile not found');
        } else if (error.response?.status === 401) {
          navigate('/signin');
        } else {
          setError('An error occurred while fetching the profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
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
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {getInitials(userData.name)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-2">{userData.email}</p>
              <p className="text-gray-600 mb-4">{userData.bio}</p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userData.stats?.totalPosts || 0}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userData.stats?.followers || 0}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userData.stats?.following || 0}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
            </div>
            {userData.isOwnProfile && (
              <div className="mt-4 md:mt-0">
                <Link
                  to="/settings"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-xl mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Posts
              </button>
              {userData.isOwnProfile && (
                <>
                  <button
                    onClick={() => setActiveTab('drafts')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'drafts'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Drafts
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'saved'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Saved
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userData.posts?.length > 0 ? (
                  userData.posts.map((post) => (
                    <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition duration-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-lg">No posts yet</p>
                    <p className="text-sm mt-2">Start sharing your thoughts with the world!</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'drafts' && (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-lg">No drafts available</p>
                <p className="text-sm mt-2">Start writing your next masterpiece!</p>
              </div>
            )}
            {activeTab === 'saved' && (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <p className="text-lg">No saved posts</p>
                <p className="text-sm mt-2">Save interesting posts to read later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 