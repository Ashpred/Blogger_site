import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../assets/styles/MainPage.css';

// Mock data for blogs
const mockBlogs = [
  {
    id: 1,
    title: 'Getting Started with React and Three.js',
    excerpt: 'Learn how to create stunning 3D visualizations on the web using React and Three.js...',
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      id: 101,
      username: 'techguru',
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      fullName: 'Alex Johnson'
    },
    createdAt: '2023-04-15T10:30:00.000Z',
    likes: 124,
    comments: 18,
    shares: 34,
    tags: ['react', 'threejs', 'webdev']
  },
  {
    id: 2,
    title: 'Modern CSS Techniques Every Developer Should Know',
    excerpt: 'Explore the latest CSS features and techniques that will transform your web designs...',
    coverImage: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    author: {
      id: 102,
      username: 'designmaster',
      profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
      fullName: 'Sarah Williams'
    },
    createdAt: '2023-04-14T14:45:00.000Z',
    likes: 89,
    comments: 12,
    shares: 21,
    tags: ['css', 'webdesign', 'frontend']
  },
  {
    id: 3,
    title: 'Building a Scalable Backend with Node.js and MongoDB',
    excerpt: 'Discover best practices for building robust and scalable backend services...',
    coverImage: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      id: 103,
      username: 'codemaster',
      profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg',
      fullName: 'Mike Chen'
    },
    createdAt: '2023-04-12T09:15:00.000Z',
    likes: 156,
    comments: 24,
    shares: 42,
    tags: ['nodejs', 'mongodb', 'backend']
  },
  {
    id: 4,
    title: 'The Future of Web Development: What to Learn in 2023',
    excerpt: 'Stay ahead of the curve by learning these technologies and skills...',
    coverImage: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      id: 104,
      username: 'futurist',
      profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
      fullName: 'Emma Rodriguez'
    },
    createdAt: '2023-04-10T16:20:00.000Z',
    likes: 213,
    comments: 31,
    shares: 59,
    tags: ['webdev', 'career', 'technology']
  }
];

// Blog Card Component
const BlogCard = ({ blog }) => {
  const [liked, setLiked] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
    hover: { 
      y: -10,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div 
      className="blog-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/blog/${blog.id}`} className="blog-card-link">
        <div className="blog-card-image">
          <img src={blog.coverImage} alt={blog.title} />
        </div>
        
        <div className="blog-card-content">
          <div className="blog-card-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">#{tag}</span>
            ))}
          </div>
          
          <h3 className="blog-card-title">{blog.title}</h3>
          <p className="blog-card-excerpt">{blog.excerpt}</p>
          
          <div className="blog-card-author">
            <img src={blog.author.profilePicture} alt={blog.author.fullName} />
            <div>
              <p className="author-name">{blog.author.fullName}</p>
              <p className="publish-date">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          
          <div className="blog-card-metrics">
            <button 
              className={`metric-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <i className={`fas fa-heart ${liked ? 'liked' : ''}`}></i>
              <span>{liked ? blog.likes + 1 : blog.likes}</span>
            </button>
            
            <div className="metric">
              <i className="fas fa-comment"></i>
              <span>{blog.comments}</span>
            </div>
            
            <div className="metric">
              <i className="fas fa-share"></i>
              <span>{blog.shares}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Main Page Component
const MainPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // In a real app, you would fetch blogs from an API
    // For now, we'll use the mock data
    const fetchBlogs = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setBlogs(mockBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
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

  // Filter and search blogs
  const filteredBlogs = blogs.filter(blog => {
    // Filter logic
    if (filter !== 'all' && !blog.tags.includes(filter)) {
      return false;
    }
    
    // Search logic
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.author.fullName.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="main-page">
      <Navbar isAuthenticated={true} />
      
      <div className="main-content">
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
              <li className={filter === 'webdev' ? 'active' : ''}>
                <button onClick={() => handleFilterChange('webdev')}>
                  <i className="fas fa-laptop-code"></i>
                  <span>Web Development</span>
                </button>
              </li>
              <li className={filter === 'frontend' ? 'active' : ''}>
                <button onClick={() => handleFilterChange('frontend')}>
                  <i className="fas fa-palette"></i>
                  <span>Frontend</span>
                </button>
              </li>
              <li className={filter === 'backend' ? 'active' : ''}>
                <button onClick={() => handleFilterChange('backend')}>
                  <i className="fas fa-server"></i>
                  <span>Backend</span>
                </button>
              </li>
              <li className={filter === 'design' ? 'active' : ''}>
                <button onClick={() => handleFilterChange('design')}>
                  <i className="fas fa-pencil-ruler"></i>
                  <span>Design</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>Settings</h3>
            <ul className="sidebar-menu">
              <li>
                <Link to="/profile/testuser">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button className="logout-btn">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="content-area">
          <div className="content-header">
            <h2>Your Feed</h2>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <div className="create-post-button">
            <Link to="/create-post" className="create-button">
              <i className="fas fa-plus"></i>
              <span>Create New Post</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No blogs found</h3>
              <p>Try changing your search or filter criteria</p>
            </div>
          ) : (
            <motion.div 
              className="blogs-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="trending-sidebar">
          <div className="trending-section">
            <h3>Top Authors</h3>
            <ul className="trending-authors">
              {mockBlogs.map(blog => (
                <li key={blog.author.id}>
                  <Link to={`/profile/${blog.author.username}`}>
                    <img src={blog.author.profilePicture} alt={blog.author.fullName} />
                    <div>
                      <p className="author-name">{blog.author.fullName}</p>
                      <p className="author-username">@{blog.author.username}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="trending-section">
            <h3>Popular Tags</h3>
            <div className="trending-tags">
              {Array.from(new Set(mockBlogs.flatMap(blog => blog.tags))).map((tag, index) => (
                <button key={index} onClick={() => handleFilterChange(tag)}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 