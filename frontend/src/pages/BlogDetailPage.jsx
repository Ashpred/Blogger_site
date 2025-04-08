import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/styles/BlogDetailPage.css';

const BlogDetailPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Mock blog data (replace with API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlog({
        id: blogId,
        title: 'Understanding the Revolutionary Impact of WebGL in Modern Web Development',
        content: `
          <p>WebGL (Web Graphics Library) has revolutionized the way we create interactive and visually stunning web applications. As a JavaScript API, WebGL allows developers to render high-performance 3D and 2D graphics directly in the browser without plugins, opening doors to immersive experiences previously unimaginable on the web.</p>
          
          <h2>The Technical Foundation of WebGL</h2>
          
          <p>At its core, WebGL provides a direct interface to the GPU, enabling hardware-accelerated rendering within an HTML canvas. It is based on OpenGL ES 2.0, making it powerful yet accessible for web environments. The pipeline begins with JavaScript code that defines geometries, applies shaders, and controls rendering, ultimately producing pixel-perfect visuals that can respond to user input in real-time.</p>
          
          <p>One of the key strengths of WebGL is its shader programming model, which uses GLSL (OpenGL Shading Language). Shaders allow developers to manipulate vertices and pixels with unprecedented control, creating effects ranging from realistic lighting to complex animations.</p>
          
          <h2>Real-World Applications</h2>
          
          <p>The versatility of WebGL has led to its adoption across numerous domains:</p>
          
          <ul>
            <li><strong>Interactive Data Visualization</strong>: WebGL powers tools that render complex datasets in 3D, allowing users to explore information spatially.</li>
            <li><strong>Educational Simulations</strong>: From molecular structures to astronomical models, WebGL enables learners to interact with scientific concepts visually.</li>
            <li><strong>Product Configuration</strong>: E-commerce platforms use WebGL to let customers visualize and customize products in 3D before purchase.</li>
            <li><strong>Virtual Tours</strong>: Real estate and tourism industries employ WebGL to create immersive walkthroughs of properties and destinations.</li>
            <li><strong>Browser Games</strong>: Complex 3D games can now run directly in the browser, removing the need for dedicated applications.</li>
          </ul>
          
          <h2>Performance Considerations</h2>
          
          <p>While WebGL offers impressive capabilities, developers must consider performance implications, especially for mobile devices. Best practices include:</p>
          
          <ol>
            <li>Optimizing geometry by reducing vertex count when possible</li>
            <li>Implementing level-of-detail systems to scale complexity based on device capability</li>
            <li>Using texture atlases to minimize draw calls</li>
            <li>Employing instancing for repeated objects</li>
            <li>Carefully managing shader complexity to avoid overwhelming less powerful GPUs</li>
          </ol>
          
          <h2>The Future with WebGPU</h2>
          
          <p>Looking ahead, WebGPU promises to build upon WebGL's foundation with a more modern architecture better aligned with today's graphics hardware. It offers improved parallelism, more efficient memory management, and a programming model that aligns with contemporary GPU capabilities.</p>
          
          <p>As browser support grows and the API matures, WebGPU is positioned to eventually succeed WebGL as the standard for high-performance graphics on the web, though WebGL will remain important for backward compatibility.</p>
          
          <h2>Conclusion</h2>
          
          <p>WebGL has transformed the web from a document-centric platform to one capable of rich, interactive experiences previously reserved for native applications. Its integration with JavaScript and HTML has democratized access to GPU-accelerated graphics, enabling developers to create stunning visual experiences that run anywhere.</p>
          
          <p>Whether for practical applications like data visualization or immersive experiences like virtual reality, WebGL continues to push the boundaries of what's possible in a browser, making it an essential tool in the modern web developer's toolkit.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        author: {
          id: '1',
          name: 'Alex Johnson',
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          bio: 'WebGL enthusiast and frontend developer',
        },
        createdAt: '2023-05-15T14:30:00Z',
        likes: 248,
        comments: [
          {
            id: '1',
            author: {
              id: '2',
              name: 'Emma Wilson',
              profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
            },
            content: "Really insightful article! I have been working with WebGL for some time now, and it's amazing how it's evolved over the years.",
            createdAt: '2023-05-15T16:45:00Z',
            likes: 12,
          },
          {
            id: '2',
            author: {
              id: '3',
              name: 'Daniel Chen',
              profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            },
            content: "Great explanation of the performance considerations. I have found that instancing has been a game-changer for my complex visualizations.",
            createdAt: '2023-05-16T09:20:00Z',
            likes: 8,
          },
          {
            id: '3',
            author: {
              id: '4',
              name: 'Sophia Martinez',
              profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            },
            content: "I'm excited about WebGPU! Have you started experimenting with it yet? Any thoughts on the transition period as browsers adopt it?",
            createdAt: '2023-05-17T11:15:00Z',
            likes: 5,
          }
        ],
        tags: ['WebGL', 'Web Development', 'Graphics', 'JavaScript', '3D'],
        shares: 57,
        related: [
          {
            id: '2',
            title: 'Getting Started with Three.js: A WebGL Framework',
            excerpt: 'Learn how to create 3D graphics with this popular WebGL framework',
            coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
          },
          {
            id: '3',
            title: 'Creating Interactive Data Visualizations with D3.js and WebGL',
            excerpt: 'Combine the power of D3 and WebGL for high-performance visualizations',
            coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          },
          {
            id: '4',
            title: 'Shader Programming: The Art of GLSL',
            excerpt: 'Master the language that powers WebGL effects and visualizations',
            coverImage: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [blogId]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // Here would be the API call to like/unlike
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
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // Here would be the API call to submit comment
    console.log('Submitting comment:', newComment);
    
    // Optimistically add comment to UI
    const userInfo = {
      id: 'current-user',
      name: 'Current User',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
    };
    
    const newCommentObj = {
      id: Date.now().toString(),
      author: userInfo,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    setBlog({
      ...blog,
      comments: [newCommentObj, ...blog.comments]
    });
    
    setNewComment('');
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
  
  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <h2>Blog post not found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/main')}
          >
            Back to Blog Feed
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Header */}
        <div className="blog-header">
          <div className="blog-header-content">
            <Link to="/main" className="back-link">
              <i className="fas fa-arrow-left"></i> Back to Feed
            </Link>
            
            <motion.h1 
              className="blog-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {blog.title}
            </motion.h1>
            
            <div className="blog-meta">
              <div className="blog-author">
                <img 
                  src={blog.author.profileImage} 
                  alt={blog.author.name} 
                  className="author-image"
                />
                <div className="author-info">
                  <Link to={`/profile/${blog.author.id}`} className="author-name">
                    {blog.author.name}
                  </Link>
                  <p className="publish-date">{formatDate(blog.createdAt)}</p>
                </div>
              </div>
              
              <div className="blog-tags">
                {blog.tags.map((tag, index) => (
                  <span className="blog-tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="blog-cover-image">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        </div>
        
        {/* Content */}
        <div className="blog-content-wrapper">
          <motion.div 
            className="blog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          {/* Actions */}
          <div className="blog-actions">
            <div className="blog-actions-left">
              <button 
                className={`action-button ${isLiked ? 'active' : ''}`} 
                onClick={handleLikeToggle}
              >
                <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                <span>{isLiked ? blog.likes + 1 : blog.likes}</span>
              </button>
              
              <button className="action-button">
                <i className="far fa-comment"></i>
                <span>{blog.comments.length}</span>
              </button>
              
              <button className="action-button" onClick={handleShare}>
                <i className="far fa-share-square"></i>
                <span>{blog.shares}</span>
              </button>
            </div>
            
            <div className="blog-actions-right">
              <button 
                className={`action-button ${isBookmarked ? 'active' : ''}`}
                onClick={handleBookmarkToggle}
              >
                <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
                <span>Save</span>
              </button>
            </div>
          </div>
          
          {/* Author Card */}
          <div className="author-card">
            <div className="author-card-left">
              <img 
                src={blog.author.profileImage} 
                alt={blog.author.name} 
                className="author-image"
              />
              <div className="author-info">
                <h3 className="author-name">{blog.author.name}</h3>
                <p className="author-bio">{blog.author.bio}</p>
              </div>
            </div>
            <div className="author-card-right">
              <Link to={`/profile/${blog.author.id}`} className="follow-button">
                Follow
              </Link>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="section-title">Comments ({blog.comments.length})</h2>
            
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button 
                type="submit"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
            
            <div className="comments-list">
              {blog.comments.map((comment) => (
                <div className="comment-card" key={comment.id}>
                  <div className="comment-author">
                    <img 
                      src={comment.author.profileImage} 
                      alt={comment.author.name} 
                      className="author-image"
                    />
                    <div className="author-info">
                      <h4 className="author-name">{comment.author.name}</h4>
                      <p className="comment-date">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  <div className="comment-actions">
                    <button className="like-button">
                      <i className="far fa-heart"></i>
                      <span>{comment.likes}</span>
                    </button>
                    <button className="reply-button">
                      <i className="far fa-comment"></i>
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Related Posts */}
          <div className="related-posts">
            <h2 className="section-title">Related Posts</h2>
            <div className="related-posts-grid">
              {blog.related.map((post) => (
                <Link to={`/blog/${post.id}`} className="related-post-card" key={post.id}>
                  <div className="related-post-image">
                    <img src={post.coverImage} alt={post.title} />
                  </div>
                  <div className="related-post-content">
                    <h3 className="related-post-title">{post.title}</h3>
                    <p className="related-post-excerpt">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 