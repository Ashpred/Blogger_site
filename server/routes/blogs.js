const express = require('express');
const { 
  createBlog, 
  getBlogs, 
  getBlog, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  commentOnBlog, 
  deleteComment,
  shareBlog
} = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Blog routes
router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.put('/like/:id', protect, likeBlog);
router.put('/share/:id', protect, shareBlog);
router.post('/comment/:id', protect, commentOnBlog);
router.delete('/comment/:id/:comment_id', protect, deleteComment);

module.exports = router; 