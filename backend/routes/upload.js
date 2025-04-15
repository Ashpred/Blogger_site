const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../controllers/upload');
const { uploadProfilePicture, uploadBlogImage, uploadContentImage } = require('../config/cloudinary');

const router = express.Router();

// Upload routes
router.post('/profile', protect, uploadProfilePicture, uploadImage);
router.post('/blog', protect, uploadBlogImage, uploadImage);
router.post('/content', protect, uploadContentImage, uploadImage);

module.exports = router; 