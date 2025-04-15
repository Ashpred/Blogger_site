import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import '../assets/styles/CreateBlogPage.css';
import EnhancedEditor from '../components/EnhancedEditor';
import { uploadBlogImage } from '../utils/imageUpload';
import { fixImageUrl } from '../utils/imageUtils';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, 
         FaAlignRight, FaListUl, FaListOl, FaLink, FaImage, 
         FaHeading, FaQuoteRight } from 'react-icons/fa';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    coverImage: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  
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

  // Handle content change from the BasicEditor
  const handleContentChange = (html) => {
    setFormData({
      ...formData,
      content: html
    });
    
    if (errors.content) {
      setErrors({
        ...errors,
        content: '',
      });
    }
  };
  
  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          coverImage: 'Image size should be less than 5MB'
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          coverImage: 'Please select a valid image file'
        });
        return;
      }
      
      // Show preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      try {
        setIsSubmitting(true);
        setUploadStatus('Uploading image...');
        
        // Upload to Cloudinary
        const imageUrl = await uploadBlogImage(file);
        console.log('Received image URL from server:', imageUrl);
        
        // Update form data with the image URL
        setFormData({
          ...formData,
          coverImage: imageUrl
        });
        
        setUploadStatus('Image uploaded successfully!');
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error in handleCoverImageChange:', error);
        setErrors({
          ...errors,
          coverImage: 'Failed to upload image. Please try again.'
        });
        setUploadStatus('Image upload failed');
        setIsSubmitting(false);
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
    
    if (!formData.coverImage && !preview) {
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
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Prepare blog data
      const blogData = {
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
        coverImage: formData.coverImage
      };
      
      console.log('Submitting blog with data:', blogData);
      
      // Send the API request
      const response = await axios.post('/api/blogs', blogData);
      
      if (response.data && response.data.data) {
        // Blog was created successfully
        const blogId = response.data.data._id;
        // Navigate to the blog page
        navigate(`/blog/${blogId}`);
      } else {
        throw new Error('Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      
      setErrors({
        ...errors,
        submit: error.response?.data?.message || 'Failed to create blog post. Please try again.'
      });
      
      setIsSubmitting(false);
    }
  };
  
  // Add a placeholder style to the head of the document
  useEffect(() => {
    // Create a style element for the placeholder
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable]:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
        font-style: italic;
        pointer-events: none;
        direction: rtl;
        text-align: left;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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
              dir="rtl"
              style={{ direction: 'rtl', textAlign: 'left' }}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <div style={{ width: '100%' }}>
              <EnhancedEditor
                initialContent={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
                className={errors.content ? 'error' : ''}
                contentRef={contentRef}
              />
            </div>
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
              dir="rtl"
              style={{ direction: 'rtl', textAlign: 'left' }}
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
                  <img src={fixImageUrl(preview)} alt="Cover preview" />
                  <span className="change-image">Change image</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload cover image</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            {errors.coverImage && <p className="error-message">{errors.coverImage}</p>}
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
          </div>
          
          {errors.submit && (
            <div className="error-banner">
              <p>{errors.submit}</p>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/main')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Publishing...</span>
                </>
              ) : 'Publish Blog Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBlogPage; 