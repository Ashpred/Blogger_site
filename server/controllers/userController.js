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
        bio: user.bio,
        subscribers: user.subscribers,
        subscribersCount: user.subscribers.length
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

// @desc   Get user by username
// @route  GET /api/users/:username
// @access Public
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
        bio: user.bio,
        subscribersCount: user.subscribers.length
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
    const { fullName, bio, profilePicture } = req.body;

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    if (profilePicture) updateFields.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true
    });

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

// @desc   Subscribe to a user
// @route  PUT /api/users/subscribe/:userId
// @access Private
exports.subscribeUser = async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot subscribe to yourself'
      });
    }

    const userToSubscribe = await User.findById(req.params.userId);

    if (!userToSubscribe) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already subscribed
    if (userToSubscribe.subscribers.includes(req.user._id)) {
      // Unsubscribe
      userToSubscribe.subscribers = userToSubscribe.subscribers.filter(
        subscriber => subscriber.toString() !== req.user._id.toString()
      );
      await userToSubscribe.save();

      return res.status(200).json({
        success: true,
        message: 'Unsubscribed successfully',
        isSubscribed: false,
        subscribersCount: userToSubscribe.subscribers.length
      });
    }

    // Subscribe
    userToSubscribe.subscribers.push(req.user._id);
    await userToSubscribe.save();

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
      isSubscribed: true,
      subscribersCount: userToSubscribe.subscribers.length
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

// @desc   Check if subscribed to a user
// @route  GET /api/users/check-subscription/:userId
// @access Private
exports.checkSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isSubscribed = user.subscribers.includes(req.user._id);

    res.status(200).json({
      success: true,
      isSubscribed,
      subscribersCount: user.subscribers.length
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