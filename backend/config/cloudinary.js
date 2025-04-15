const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if environment variables are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary environment variables missing:');
  console.error('CLOUDINARY_CLOUD_NAME:', cloudName ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_KEY:', apiKey ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_SECRET:', apiSecret ? 'Set' : 'Missing');
  throw new Error('Cloudinary configuration is incomplete. Please check .env file.');
}

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  
  // Verify the configuration by making a simple API call
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error('Cloudinary ping failed:', error);
    } else {
      console.log('Cloudinary ping successful:', result.status);
    }
  });
  
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Error configuring Cloudinary:', error);
  throw error;
}

// Configure storage for profile pictures with error handling
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogsphere/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Configure storage for blog images with error handling
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogsphere/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Enhanced error handling for multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer/Cloudinary upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: err.message
    });
  }
  next();
};

// Create upload middleware with error handling
const uploadProfilePicture = (req, res, next) => {
  multer({ storage: profileStorage }).single('profilePicture')(req, res, (err) => {
    if (err) {
      console.error('Profile picture upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error uploading profile picture',
        error: err.message
      });
    }
    next();
  });
};

const uploadBlogImage = (req, res, next) => {
  multer({ storage: blogStorage }).single('coverImage')(req, res, (err) => {
    if (err) {
      console.error('Blog image upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error uploading blog image',
        error: err.message
      });
    }
    next();
  });
};

module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadBlogImage
}; 