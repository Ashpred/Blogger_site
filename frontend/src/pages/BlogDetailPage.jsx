import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fixImageUrl } from '../utils/imageUtils';
import BlogMetrics from '../components/BlogMetrics';
import '../assets/styles/BlogDetailPage.css';
import '../assets/styles/BlogContent.css';

const BlogDetailPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${blogId}`);
        
        if (response.data && response.data.data) {
          const blogData = response.data.data;
          setBlog(blogData);
          
          // Check if user has already liked this blog
          if (user && blogData.likes && blogData.likes.includes(user.id)) {
            setIsLiked(true);
          }
        } else {
          setError('Failed to load blog data');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data?.message || 'Failed to load blog data');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogData();
    }
  }, [blogId, user]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLikeToggle = async () => {
    try {
      const response = await axios.put(`/api/blogs/like/${blogId}`);
      
      if (response.data && response.data.data) {
        // Update the blog in state with the new likes data
        setBlog(response.data.data);
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // Here would be the API call to bookmark/unbookmark
  };
  
  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post(`/api/blogs/comment/${blogId}`, {
        text: newComment
      });
      
      if (response.data && response.data.data) {
        // Update blog with new comments
        setBlog(response.data.data);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Failed to load blog post'}</p>
          <button onClick={() => navigate('/main')}>
            Back to Feed
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="blog-detail-page">
      <div className="blog-container">
        {/* Cover Image at the top */}
        <div className="blog-cover-image-container">
          <div className="blog-cover-image">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        </div>
        
        {/* Blog Header with title and author info */}
        <div className="blog-header">
          <div className="blog-info">
            <h1 className="blog-title">{blog.title}</h1>
            
            <div className="blog-meta">
              <div className="blog-author">
                <img 
                  src={blog.author.profilePicture ? fixImageUrl(blog.author.profilePicture) : '/default-profile.jpg'} 
                  alt={blog.author.fullName || blog.author.username} 
                  className="author-image"
                />
                <div className="author-info">
                  <Link to={`/profile/${blog.author.username}`} className="author-name">
                    {blog.author.fullName || blog.author.username}
                  </Link>
                  <p className="publish-date">{formatDate(blog.createdAt)}</p>
                </div>
              </div>
              
              <div className="blog-tags">
                {blog.tags && blog.tags.map((tag, index) => (
                  <span className="blog-tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="blog-detail-content">
          <div className="blog-content-body" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>
        
        {/* Actions Bar */}
        <div className="blog-actions">
          <BlogMetrics 
            likes={blog.likes ? blog.likes.length : 0}
            comments={blog.comments ? blog.comments.length : 0}
            shares={blog.shares || 0}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onLike={handleLikeToggle}
            onComment={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
            onShare={handleShare}
            onBookmark={handleBookmarkToggle}
          />
        </div>
        
        {/* Comments Section */}
        <div id="comments-section" className="comments-section">
          <h3 className="comments-title">Comments ({blog.comments ? blog.comments.length : 0})</h3>
          
          {/* Comment Form */}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>
          
          {/* Comments List */}
          <div className="comments-list">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div className="comment" key={comment._id}>
                  <div className="comment-author">
                    <img 
                      src={comment.user?.profilePicture ? fixImageUrl(comment.user.profilePicture) : '/default-profile.jpg'} 
                      alt={comment.user?.username} 
                      className="author-image"
                    />
                    <div className="comment-info">
                      <Link to={`/profile/${comment.user?.username}`} className="author-name">
                        {comment.user?.username}
                      </Link>
                      <span className="comment-date">{formatDate(comment.date)}</span>
                    </div>
                  </div>
                  <div className="comment-content">{comment.text}</div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 