/**
 * MongoDB Atlas Connection Test Script
 * 
 * Run this script to verify your connection to MongoDB Atlas
 * Usage: node scripts/testConnection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Hide sensitive info in logs
const sanitizedUri = process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('Testing connection to MongoDB Atlas...');
console.log('Connection URI:', sanitizedUri);

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Faster timeout for testing
};

// Test connection
mongoose.connect(process.env.MONGO_URI, options)
  .then(async (conn) => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log(`Connected to MongoDB Atlas at: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    try {
      // Get list of collections
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('\nAvailable collections:');
      collections.forEach(coll => {
        console.log(`- ${coll.name}`);
      });
      
      // Count documents in each collection
      console.log('\nCollection stats:');
      for (const coll of collections) {
        const count = await conn.connection.db.collection(coll.name).countDocuments();
        console.log(`- ${coll.name}: ${count} documents`);
      }
    } catch (err) {
      console.error('Error fetching collection info:', err.message);
    }
    
    console.log('\n✅ Your connection to MongoDB Atlas is correctly configured!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ CONNECTION FAILED!');
    console.error(`Error: ${err.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check that your IP is whitelisted in MongoDB Atlas');
    console.error('2. Verify username and password in the connection string');
    console.error('3. Make sure Atlas cluster is running (not paused)');
    console.error('4. Check network connectivity and firewall settings');
    process.exit(1);
  }); 