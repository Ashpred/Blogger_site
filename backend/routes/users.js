const express = require('express');
const { 
  getCurrentUser, 
  getUserByUsername, 
  updateProfile, 
  getUserBlogs, 
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadProfilePicture } = require('../config/cloudinary');

const router = express.Router();


// User routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, uploadProfilePicture, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/:username', getUserByUsername);
router.get('/:username/blogs', getUserBlogs);

module.exports = router; 