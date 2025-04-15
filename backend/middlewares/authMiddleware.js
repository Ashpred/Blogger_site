const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  console.log('Auth middleware triggered');
  console.log('Headers:', JSON.stringify(req.headers));

  // Check if token exists in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from headers');
  } else {
    console.log('No Bearer token found in authorization header');
  }

  // Check if no token
  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    console.log('Attempting to verify token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user ID:', decoded.id);

    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('Authentication failed: User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    console.log('User authenticated successfully:', user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
}; 