const { cloudinary } = require('../config/cloudinary');

// @desc   Upload image to Cloudinary
// @route  POST /api/upload/image
// @access Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
}; 