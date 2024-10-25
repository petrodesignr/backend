const bcrypt = require('bcrypt');  // Import bcrypt for hashing passwords
const jwt = require('jsonwebtoken');  // Import JSON Web Token to generate secure tokens for user authentication
const User = require('../models/User');  // Import the User model for interacting with the user database

// Controller for user signup
exports.signup = (req, res, next) => {
    // Hash the user's password with a salt of 10 rounds
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Create a new User instance with the email and hashed password
        const user = new User({
          email: req.body.email,  // User's email from the request body
          password: hash  // Hashed password to store in the database
        });

        // Save the new user in the database
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))  // Send success response if user is created
          .catch(error => res.status(400).json({ error }));  // Handle any errors during save
      })
      .catch(error => res.status(500).json({ error }));  // Handle errors in password hashing
};


// Controller for user login
exports.login = (req, res, next) => {
    // Find the user in the database by their email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {  // If the user is not found
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });  // Send unauthorized response
            }

            // Compare the provided password with the stored hashed password
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {  // If the password is incorrect
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });  // Send unauthorized response
                    }

                    // Send the user ID and a new authentication token in the response if password is valid
                    res.status(200).json({
                        userId: user._id,  // The user's unique ID
                        token: jwt.sign(  // Generate a JSON Web Token for the user
                            { userId: user._id },  // Payload containing the user's ID
                            'RANDOM_TOKEN_SECRET',  // Secret key to sign the token
                            { expiresIn: '24h' }  // Token expiration time
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));  // Handle errors during password comparison
        })
        .catch(error => res.status(500).json({ error }));  // Handle errors when finding the user
};


// Controller to get all users
exports.getAllUsers = (req, res, next) => {
    User.find()  // Retrieve all users from the database
      .then(users => res.status(200).json(users))  // Send all users as JSON
      .catch(error => res.status(400).json({ error }));  // Handle errors in retrieval
};
