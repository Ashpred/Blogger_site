import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { getDefaultAvatar } from '../utils/avatarUtils';
import { fixImageUrl } from '../utils/imageUtils';
import '../assets/styles/BlogCard.css';

const BlogCard = ({ blog }) => {
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6 
      }
    },
    hover: { 
      y: -8,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  const imageVariants = {
    hover: {
      scale: 1.08,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };
  
  const tagVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.3, delay: 0.1 }
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
      <Link to={`/blog/${blog._id}`} className="blog-card-link">
        {blog.coverImage ? (
          <div className="blog-card-image-container">
            <motion.img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="blog-card-image"
              variants={imageVariants}
            />
          </div>
        ) : (
          <div className="blog-card-image-container">
            <div className="blog-card-image blog-card-placeholder">
              <i className="fas fa-image"></i>
            </div>
          </div>
        )}
        
        <div className="blog-card-content">
          <motion.div className="blog-card-tags" variants={tagVariants}>
            {blog.tags?.slice(0, 3).map((tag, index) => (
              <motion.span 
                key={index} 
                className="blog-tag"
                variants={tagVariants}
                whileHover={{ y: -2, scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          
          <h3 className="blog-card-title">{truncate(blog.title, 80)}</h3>
          
          <p className="blog-card-excerpt">{truncate(blog.content, 180)}</p>
          
          <div className="blog-card-footer">
            <div className="blog-author">
              {blog.author?.profilePicture ? (
                <motion.div className="author-avatar">
                  <img 
                    src={blog.author.profilePicture ? fixImageUrl(blog.author.profilePicture) : getDefaultAvatar(blog.author?.username, blog.author?._id)}
                    alt={blog.author?.fullName}
                    whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="author-avatar"
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  {getInitials(blog.author?.fullName)}
                </motion.div>
              )}
              
              <div className="author-info">
                <span className="author-name">
                  {blog.author?.fullName || 'Anonymous'}
                </span>
                <span className="blog-date">
                  <TimeAgo date={blog.createdAt} />
                </span>
              </div>
            </div>
            
            <div className="blog-stats">
              <motion.div 
                className="stat-container"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <i className="fas fa-heart"></i> 
                <span className="stat-count">{blog.likes?.length || 0}</span>
              </motion.div>
              <motion.div 
                className="stat-container"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <i className="fas fa-comment"></i> 
                <span className="stat-count">{blog.comments?.length || 0}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard; 