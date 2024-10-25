const express = require('express');  // Import the express library to create the router
const router = express.Router();  // Create a new router instance

// Import middleware for authentication and file handling
const auth = require('../middleware/auth');  // Middleware for user authentication
const multer = require('../middleware/multer-config');  // Middleware for handling file uploads

// Import the controller functions for handling requests related to "things"
const stuffCtrl = require('../controllers/stuff');

// Define routes for the "things" resource

// GET request to retrieve all things; requires authentication
router.get('/', auth, stuffCtrl.getAllThings);

// POST request to create a new thing; requires authentication and file upload handling
router.post('/', auth, multer, stuffCtrl.createThing);

// GET request to retrieve a single thing by ID; requires authentication
router.get('/:id', auth, stuffCtrl.getOneThing);

// PUT request to modify an existing thing by ID; requires authentication and file upload handling
router.put('/:id', auth, multer, stuffCtrl.modifyThing);

// DELETE request to remove a thing by ID; requires authentication
router.delete('/:id', auth, stuffCtrl.deleteThing);

// Export the router to be used in the main application
module.exports = router;
