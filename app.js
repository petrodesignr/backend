const express = require('express');  // Import the express library to create the server
const mongoose = require('mongoose');  // Import mongoose for MongoDB interactions
const stuffRoutes = require('./routes/stuff');  // Import routes for handling "stuff" related requests
const userRoutes = require('./routes/user');  // Import routes for handling user related requests
const app = express();  // Create an instance of an Express application
const path = require('path');  // Import path module for handling file and directory paths

// MongoDB connection URI
const uri = "mongodb+srv://test_user:1234Test@cluster0.zho41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection - keep it alive
async function run() {
  try {
    await mongoose.connect(uri);  // Attempt to connect to MongoDB
    console.log("Connected to MongoDB successfully.");  // Log success message
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);  // Log any errors during connection
  }
}
run();  // Call the run function to initiate the database connection

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware configuration to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins to access the API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');  // Allow specific headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  // Allow specific HTTP methods
  next();  // Pass the request to the next middleware or route handler
});

// Define API routes for "stuff" and user authentication
app.use('/api/stuff', stuffRoutes);  // Handle requests for "stuff" related operations
app.use('/api/auth', userRoutes);  // Handle requests for user authentication
app.use('/api/user', userRoutes);  // Handle requests for user-related operations (this can be adjusted as needed)

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));  // Serve image files

// Export the Express application for use in other files (like server.js)
module.exports = app;
