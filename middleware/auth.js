const jwt = require('jsonwebtoken');  // Import JSON Web Token library to handle token verification

// Middleware function to authenticate incoming requests
module.exports = (req, res, next) => {
    try {
        // Extract the token from the authorization header in the request
        const token = req.headers.authorization.split(' ')[1];  // Assuming format: "Bearer <token>"

        // Verify the token with the secret key and decode the payload
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // Secret must match the one used when the token was created

        // Extract userId from the decoded token payload
        const userId = decodedToken.userId;

        // Attach the userId to the request object for downstream use
        req.auth = { 
            userId: userId  // Store userId in the `auth` property for secure reference in further request handling
        };

        next();  // Proceed to the next middleware or route handler if the token is valid
    } catch (error) {
        // Send an unauthorized error response if the token is invalid or missing
        res.status(401).json({ error });
    }
};
