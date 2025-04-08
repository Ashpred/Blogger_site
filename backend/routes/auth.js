const express = require('express');
const { register, login, verifyEmail, resendOTP } = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-otp', resendOTP);

module.exports = router; 