const Thing = require('../models/Thing');  // Import the Thing model to interact with the database
const fs = require('fs');  // Import Node.js's file system module to work with file deletion

// Controller to create a new "thing"
exports.createThing = (req, res, next) => {
    // Parse JSON data from the request body. It contains the main object data.
    const thingObject = JSON.parse(req.body.thing);

    // Remove fields from thingObject that should not be used in the new object
    delete thingObject._id;  // Remove any _id to avoid conflicts with MongoDB's unique ID
    delete thingObject.userId;  // Prevent overriding the userId

    // Create a new Thing instance with parsed data, the authenticated user's ID, and image URL
    const thing = new Thing({
        ...thingObject,  // Spread operator to copy all properties of thingObject
        userId: req.auth.userId,  // Use the authenticated user's ID from the auth middleware
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Construct the URL for the uploaded image
    });

    // Save the new "thing" to the database
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))  // Send a success response
        .catch(error => res.status(400).json({ error }));  // Send an error response in case of failure
}; 


// Controller to modify an existing "thing"
exports.modifyThing = (req, res, next) => {
  // Determine if a new file is included in the request
  const thingObject = req.file ? {
    ...JSON.parse(req.body.thing),  // Parse JSON if a new file is included
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Update image URL
  } : { ...req.body };  // Otherwise, use the existing data from req.body directly

  delete thingObject._userId;  // Prevent unauthorized changes to userId

  // Find the "thing" by ID and check if the user is authorized to modify it
  Thing.findOne({_id: req.params.id})
    .then((thing) => {
      if (thing.userId != req.auth.userId) {  // Check if the authenticated user is the owner
        res.status(401).json({ message : 'Not authorized'});  // Send unauthorized error if not the owner
      } else {
        // Update the "thing" with the modified data
        Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet modifié!'}))  // Send success response
          .catch(error => res.status(401).json({ error }));  // Catch and handle errors during update
      }
    })
    .catch((error) => {
      res.status(400).json({ error });  // Catch and handle errors when finding the "thing"
    });
};


// Controller to delete an existing "thing"
exports.deleteThing = (req, res, next) => {
    // Find the "thing" by ID to ensure it exists and the user is authorized
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {  // Check if the user is the owner
                res.status(401).json({message: 'Not authorized'});  // Unauthorized if not the owner
            } else {
                // Extract the filename from the image URL
                const filename = thing.imageUrl.split('/images/')[1];
                
                // Delete the image file from the server
                fs.unlink(`images/${filename}`, () => {
                    // Delete the "thing" from the database after the image file is removed
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})  // Success response
                        .catch(error => res.status(401).json({ error }));  // Error if deletion fails
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });  // Handle errors in finding the "thing"
        });
};


// Controller to get a specific "thing" by ID
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })  // Find the "thing" by ID
      .then(thing => res.status(200).json(thing))  // Send the found "thing" as JSON
      .catch(error => res.status(404).json({ error }));  // Send a 404 error if not found
};

// Controller to get all "things"
exports.getAllThings = (req, res, next) => {
    Thing.find()  // Retrieve all "things" from the database
      .then(things => res.status(200).json(things))  // Send all "things" as JSON
      .catch(error => res.status(400).json({ error }));  // Send an error response in case of failure
};
