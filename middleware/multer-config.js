const multer = require('multer');  // Import the multer library for handling file uploads

// Define a mapping of MIME types to file extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',      // Map for JPG images
    'image/jpeg': 'jpg',     // Map for JPEG images
    'image/png': 'png'       // Map for PNG images
};

// Set up storage configuration for multer
const storage = multer.diskStorage({
    // Define the destination where uploaded files will be stored
    destination: (req, file, callback) => {
        callback(null, 'images');  // Store files in the 'images' directory
    },
    // Define the filename for the uploaded file
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');  // Replace spaces in the original filename with underscores
        const extension = MIME_TYPES[file.mimetype];  // Get the appropriate file extension from the MIME type
        // Create a new filename using the original name, current timestamp, and the file extension
        callback(null, name + Date.now() + '.' + extension);  
    }
});

// Export the multer middleware configured to use the defined storage settings
// .single('image') specifies that we expect a single file upload with the field name 'image'
module.exports = multer({ storage: storage }).single('image');
