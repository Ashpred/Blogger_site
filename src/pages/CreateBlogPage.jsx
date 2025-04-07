import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/styles/CreateBlogPage.css';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    coverImage: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        coverImage: file,
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.coverImage) {
        setErrors({
          ...errors,
          coverImage: '',
        });
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title should be at least 5 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content should be at least 100 characters';
    }
    
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }
    
    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data for sending the image
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('coverImage', formData.coverImage);
      
      // This is where we would make the API call
      // For now, let's simulate an API call with a timeout
      setTimeout(() => {
        console.log('Blog post created successfully:', formDataToSend);
        setIsSubmitting(false);
        navigate('/blog-success');
      }, 2000);
      
      // Actual API call would look like this:
      // const response = await fetch('/api/blogs', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create blog post');
      // }
      // 
      // const data = await response.json();
      // navigate(`/blog/${data.blog._id}`);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      setIsSubmitting(false);
      setErrors({
        submit: 'Failed to create blog post. Please try again.',
      });
    }
  };
  
  return (
    <div className="create-blog-page">
      <motion.div 
        className="create-blog-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="create-blog-header">
          <h1>Create New Blog Post</h1>
          <p>Share your thoughts, ideas, and stories with the world</p>
        </div>
        
        <form className="create-blog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows="12"
              className={errors.content ? 'error' : ''}
            ></textarea>
            {errors.content && <p className="error-message">{errors.content}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="technology, programming, web development"
              className={errors.tags ? 'error' : ''}
            />
            {errors.tags && <p className="error-message">{errors.tags}</p>}
          </div>
          
          <div className="form-group">
            <label>Cover Image</label>
            <div 
              className={`cover-image-upload ${errors.coverImage ? 'error' : ''}`}
              onClick={triggerFileInput}
            >
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Cover preview" />
                  <span className="change-image">Change image</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload cover image</p>
                  <span>JPG, PNG or GIF (Max 5MB)</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
            </div>
            {errors.coverImage && <p className="error-message">{errors.coverImage}</p>}
          </div>
          
          {errors.submit && <div className="error-banner">{errors.submit}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  Publishing...
                </>
              ) : (
                'Publish Blog Post'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBlogPage; 