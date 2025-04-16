const User = require('../models/User');
const Blog = require('../models/Blog');

// @desc   Get current user profile
// @route  GET /api/users/me
// @access Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
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


exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
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

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'Present' : 'Not present');
    
    const { fullName, bio } = req.body;

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    
    // If a file was uploaded, use the path provided by Cloudinary
    if (req.file && req.file.path) {
      console.log('New profile picture uploaded:', req.file.path);
      updateFields.profilePicture = req.file.path;
    }

    console.log('Update fields being applied:', Object.keys(updateFields));

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true
    });

    if (!user) {
      console.log('User not found for ID:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User updated successfully:', {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture ? 'Set' : 'Not set'
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Get blogs by user
// @route  GET /api/users/:username/blogs
// @access Public
exports.getUserBlogs = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const blogs = await Blog.find({ author: user._id })
      .sort({ createdAt: -1 })
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

// @desc   Change user password
// @route  PUT /api/users/change-password
// @access Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if both passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current and new password are required'
      });
    }

    // Get user with password (which is normally not included in queries due to select: false)
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 