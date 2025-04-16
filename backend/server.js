// Load environment variables from .env file before any other imports
require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// Config
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Error handling middleware - should be defined after routes are used
const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Apply error handler after routes
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Create server and add helpful startup log messages
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
  // server.close(() => process.exit(1));
}); 