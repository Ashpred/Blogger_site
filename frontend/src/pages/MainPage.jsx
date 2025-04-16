import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/MainPage.css';
import BlogMetrics from '../components/BlogMetrics';

// Blog Card Component
const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);
  
  useEffect(() => {
    // Check if the current user has liked this blog
    if (user && blog.likes && Array.isArray(blog.likes)) {
      setIsLiked(blog.likes.includes(user.id));
    }
    
    setLikeCount(blog.likes?.length || 0);
  }, [blog.likes, user]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await axios.put(`/api/blogs/like/${blog._id}`);
      if (response.data && response.data.data) {
        setIsLiked(!isLiked);
        setLikeCount(response.data.data.likes.length);
      }
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };
  
  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog/${blog._id}`);
  };
  
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Extract plain text from HTML content if needed
  const extractPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const excerpt = truncateText(extractPlainText(blog.content), 150);

  return (
    <motion.div 
      className="blog-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/blog/${blog._id}`} className="blog-card-link">
        <div className="blog-card-image">
          <img src={blog.coverImage || '/default-blog-cover.jpg'} alt={blog.title} />
          <div className="blog-card-tags">
            {blog.tags && blog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="blog-card-content">
          <div className="blog-card-author">
            <img 
              src={blog.author.profilePicture || '/default-profile.jpg'} 
              alt={blog.author.username} 
              className="author-image"
            />
            <div className="author-info">
              <h4 className="author-name">{blog.author.fullName || blog.author.username}</h4>
              <p className="blog-date">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          
          <h3 className="blog-card-title">{blog.title}</h3>
          <p className="blog-card-excerpt">{excerpt}</p>
        </div>
      </Link>
      
      <BlogMetrics 
        likes={likeCount}
        comments={blog.comments?.length || 0}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={handleComment}
      />
    </motion.div>
  );
};

// Main Page Component
const MainPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch blogs from the API
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/blogs');
        if (response.data && response.data.data) {
          setBlogs(response.data.data);
          
          // Extract all unique tags from blogs
          const allTags = response.data.data.flatMap(blog => blog.tags || []);
          const uniqueTags = [...new Set(allTags)];
          setTags(uniqueTags);
          
          // Create a list of top authors based on blog count
          const authorCounts = {};
          response.data.data.forEach(blog => {
            if (blog.author && blog.author._id) {
              if (!authorCounts[blog.author._id]) {
                authorCounts[blog.author._id] = {
                  count: 0,
                  author: blog.author
                };
              }
              authorCounts[blog.author._id].count += 1;
            }
          });
          
          // Convert to array and sort by count
          const authors = Object.values(authorCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5) // Take top 5 authors
            .map(item => item.author);
          
          setTopAuthors(authors);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter blogs based on selected filter and search query
  const getFilteredBlogs = () => {
    let filteredResults = [...blogs];
    
    // Apply tag filter
    if (filter !== 'all') {
      filteredResults = filteredResults.filter(blog => 
        blog.tags && blog.tags.some(tag => 
          tag.toLowerCase() === filter.toLowerCase()
        )
      );
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        (blog.content && blog.content.toLowerCase().includes(query)) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return filteredResults;
  };

  const filteredBlogs = getFilteredBlogs();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  return (
    <div className="main-page">
      <div className="main-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Explore</h3>
            <ul className="sidebar-menu">
              <li className={filter === 'all' ? 'active' : ''}>
                <button onClick={() => handleFilterChange('all')}>
                  <i className="fas fa-globe"></i>
                  <span>All Posts</span>
                </button>
              </li>
              {tags.slice(0, 8).map((tag, index) => (
                <li key={index} className={filter === tag ? 'active' : ''}>
                  <button onClick={() => handleFilterChange(tag)}>
                    <i className="fas fa-hashtag"></i>
                    <span>{tag}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>Account</h3>
            <ul className="sidebar-menu">
              <li>
                <Link to={`/profile/${user?.username}`}>
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/create-blog">
                  <i className="fas fa-pencil-alt"></i>
                  <span>Create Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="content-area">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No blogs found</h3>
              <p>
                {filter !== 'all' 
                  ? `No blogs found with the tag "${filter}".` 
                  : searchQuery 
                    ? `No blogs match your search "${searchQuery}".`
                    : 'No blogs have been published yet.'}
              </p>
              {(filter !== 'all' || searchQuery) && (
                <button 
                  className="reset-filters"
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <motion.div 
              className="blogs-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <div className="trending-sidebar">
          <div className="trending-section">
            <h3>Top Authors</h3>
            <ul className="trending-authors">
              {topAuthors.map(author => (
                <li key={author._id}>
                  <Link to={`/profile/${author.username}`}>
                    <img src={author.profilePicture || '/default-profile.jpg'} alt={author.fullName || author.username} />
                    <div>
                      <p className="author-name">{author.fullName || author.username}</p>
                      <p className="author-username">@{author.username}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {topAuthors.length === 0 && (
                <li className="no-authors">
                  <p>No authors found</p>
                </li>
              )}
            </ul>
          </div>
          
          <div className="trending-section">
            <h3>Popular Tags</h3>
            <div className="trending-tags">
              {tags.map((tag, index) => (
                <button key={index} onClick={() => handleFilterChange(tag)}>
                  #{tag}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="no-tags">No tags found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 