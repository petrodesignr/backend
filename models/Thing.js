const mongoose = require('mongoose');  // Import mongoose library for MongoDB object modeling

// Define a schema for the 'Thing' model
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },  // Title of the thing; must be a string and is required
    description: { type: String, required: true },  // Description of the thing; must be a string and is required
    imageUrl: { type: String, required: true },  // URL of the image associated with the thing; must be a string and is required
    price: { type: Number, required: true },  // Price of the thing; must be a number and is required
    userId: { type: String, required: true },  // ID of the user who created this thing; must be a string and is required
});

// Export the Thing model based on the defined schema
module.exports = mongoose.model('Thing', thingSchema);
