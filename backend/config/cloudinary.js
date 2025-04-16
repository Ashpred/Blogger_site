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
  
  console.log('Cloudinary config values:');
  console.log('- Cloud Name:', cloudName);
  console.log('- API Key:', apiKey ? `${apiKey.substring(0, 3)}...` : 'undefined');
  console.log('- API Secret:', apiSecret ? `${apiSecret.substring(0, 3)}...` : 'undefined');
  
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
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
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

// Configure storage for content images with error handling
const contentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogsphere/content',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// Create upload middleware with error handling
const uploadProfilePicture = (req, res, next) => {
  console.log('Starting profile picture upload middleware');
  multer({ storage: profileStorage }).single('profilePicture')(req, res, (err) => {
    if (err) {
      console.error('Profile picture upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error uploading profile picture',
        error: err.message
      });
    }
    
    console.log('Profile picture processed by multer');
    
    // If no file was uploaded, continue without error
    // This allows updating profile without changing picture
    if (!req.file) {
      console.log('No profile picture file found in request, continuing with update');
      return next();
    }
    
    console.log('File details:', {
      path: req.file.path,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    next();
  });
};

const uploadBlogImage = (req, res, next) => {
  console.log('Starting blog image upload middleware');
  multer({ storage: blogStorage }).single('coverImage')(req, res, (err) => {
    if (err) {
      console.error('Blog image upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error uploading blog image',
        error: err.message
      });
    }
    
    console.log('Blog image processed by multer');
    if (!req.file) {
      console.error('No file found in the request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: 'File is missing in the request'
      });
    }
    
    next();
  });
};

const uploadContentImage = (req, res, next) => {
  console.log('Starting content image upload middleware');
  multer({ storage: contentStorage }).single('contentImage')(req, res, (err) => {
    if (err) {
      console.error('Content image upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error uploading content image',
        error: err.message
      });
    }
    
    console.log('Content image processed by multer');
    if (!req.file) {
      console.error('No file found in the request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: 'File is missing in the request'
      });
    }
    
    next();
  });
};

module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadBlogImage,
  uploadContentImage
}; 