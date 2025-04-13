const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc   Create a new blog post
// @route  POST /api/blogs
// @access Private
exports.createBlog = async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;

    // Create new blog post
    const blog = await Blog.create({
      title,
      content,
      coverImage: coverImage || 'default-blog-cover.jpg',
      author: req.user._id,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Get all blog posts
// @route  GET /api/blogs
// @access Public
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('author', 'fullName username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Get single blog post
// @route  GET /api/blogs/:id
// @access Public
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'fullName username profilePicture bio')
      .populate('comments.user', 'username profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Update blog post
// @route  PUT /api/blogs/:id
// @access Private
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Delete blog post
// @route  DELETE /api/blogs/:id
// @access Private
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Like/Unlike a blog post
// @route  PUT /api/blogs/like/:id
// @access Private
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if the blog has already been liked by the user
    const isLiked = blog.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // Like the blog
      blog.likes.push(req.user._id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
      message: isLiked ? 'Blog unliked' : 'Blog liked'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Comment on a blog post
// @route  POST /api/blogs/comment/:id
// @access Private
exports.commentOnBlog = async (req, res) => {
  try {
    const { text } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Add comment
    blog.comments.unshift({
      user: req.user._id,
      text,
      date: Date.now()
    });

    await blog.save();

    // Return the updated blog with populated comments
    const updatedBlog = await Blog.findById(req.params.id)
      .populate('comments.user', 'username profilePicture');

    res.status(200).json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Delete comment
// @route  DELETE /api/blogs/comment/:id/:comment_id
// @access Private
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Find comment
    const comment = blog.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or blog author
    if (
      comment.user.toString() !== req.user._id.toString() &&
      blog.author.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Remove comment
    blog.comments = blog.comments.filter(
      comment => comment._id.toString() !== req.params.comment_id
    );

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Increment share count
// @route  PUT /api/blogs/share/:id
// @access Private
exports.shareBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment share count
    blog.shares += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
      message: 'Share count incremented'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Get popular blog posts
// @route  GET /api/blogs/popular
// @access Public
exports.getPopularBlogs = async (req, res) => {
  try {
    // Get popular blogs based on a combination of likes, comments, and shares
    // Limit to 5 popular blogs
    const blogs = await Blog.find()
      .sort({ likes: -1, shares: -1, 'comments.length': -1 })
      .limit(5)
      .populate('author', 'fullName username profilePicture');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 