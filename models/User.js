const mongoose = require('mongoose');  // Import the mongoose library for MongoDB object modeling

const uniqueValidator = require('mongoose-unique-validator');  // Import the unique validator plugin to enforce unique fields

// Define a schema for the 'User' model
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },  // Email field; must be a string, required, and unique across the collection
  password: { type: String, required: true }  // Password field; must be a string and is required
});

// Apply the uniqueValidator plugin to the userSchema
userSchema.plugin(uniqueValidator);  // Ensures that duplicate values for the email field will throw a validation error

// Export the User model based on the defined schema
module.exports = mongoose.model('User', userSchema);
