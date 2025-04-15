const { cloudinary } = require('../config/cloudinary');

// @desc   Upload image to Cloudinary
// @route  POST /api/upload/image
// @access Private
exports.uploadImage = async (req, res) => {
  try {
    // Add additional debug information
    console.log('Upload request received');
    console.log('File in request:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    // Log the file details
    console.log('File details:', {
      path: req.file.path,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Verify that the file was successfully uploaded to Cloudinary
    if (!req.file.path) {
      console.error('Missing file path: Cloudinary upload may have failed');
      return res.status(500).json({
        success: false,
        message: 'File uploaded but Cloudinary URL not returned'
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error details:', error);
    // Log full error details including stack trace
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
}; 