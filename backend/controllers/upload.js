const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Upload image and return url
 * @route   POST /api/upload
 * @access  Private
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided or upload failed'
      });
    }

    console.log('File successfully uploaded to Cloudinary:', req.file.path);
    
    // Return success response with image URL
    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error('Error in uploadImage controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during image upload',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage
}; 