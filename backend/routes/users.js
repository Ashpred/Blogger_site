const express = require('express');
const { 
  getCurrentUser, 
  getUserByUsername, 
  updateProfile, 
  getUserBlogs, 
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Debug route to check if the server is properly handling requests
router.get('/debug', (req, res) => {
  console.log('Debug route accessed');
  res.status(200).json({ success: true, message: 'Debug route working' });
});

// User routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/:username', getUserByUsername);
router.get('/:username/blogs', getUserBlogs);

module.exports = router; 