const express = require('express');  // Import the express library to create the router
const router = express.Router();  // Create a new router instance

// Import the user controller for handling user-related actions
const userCtrl = require('../controllers/user');

// Import the authentication middleware for protecting certain routes
const auth = require('../middleware/auth');

// Define routes for user authentication and management

// POST request for user signup; calls the signup method in the user controller
router.post('/signup', userCtrl.signup);

// POST request for user login; calls the login method in the user controller
router.post('/login', userCtrl.login);

// GET request to retrieve all users; requires authentication to access
router.get('/', auth, userCtrl.getAllUsers);

// Export the router to be used in the main application
module.exports = router;
