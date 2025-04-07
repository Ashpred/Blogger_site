const express = require('express');
const { 
  getCurrentUser, 
  getUserByUsername, 
  updateProfile, 
  getUserBlogs, 
  subscribeUser, 
  checkSubscription 
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/subscribe/:userId', protect, subscribeUser);
router.get('/check-subscription/:userId', protect, checkSubscription);
router.get('/:username', getUserByUsername);
router.get('/:username/blogs', getUserBlogs);

module.exports = router; 