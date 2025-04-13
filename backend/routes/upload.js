const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadProfilePicture, uploadBlogImage } = require('../config/cloudinary');

const router = express.Router();

// Image upload routes
router.post('/profile', protect, uploadProfilePicture, uploadImage);
router.post('/blog', protect, uploadBlogImage, uploadImage);

module.exports = router; 