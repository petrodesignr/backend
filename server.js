const http = require('http'); // Import the http module for creating an HTTP server
const app = require('./app'); // Import the app module (Express application)

// Normalize the port number to ensure it's a valid port
const normalizePort = val => {
  const port = parseInt(val, 10); // Convert the value to an integer

  if (isNaN(port)) { // If it's not a number
    return val; // Return the original value (could be a named pipe)
  }
  if (port >= 0) { // If the port number is valid (non-negative)
    return port; // Return the valid port number
  }
  return false; // Return false for invalid port
};

// Set the port from environment variable or default to '3000'
const port = normalizePort(process.env.PORT || '3000');

// Set the port to the app instance so it can be used in the app
app.set('port', port);

// Handle errors that occur when the server tries to listen on a port
const errorHandler = error => {
  if (error.syscall !== 'listen') { // If the error is not related to listening
    throw error; // Throw the error for further handling
  }
  const address = server.address(); // Get the address the server is listening on
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Determine if it's a named pipe or port
  // Handle specific error codes
  switch (error.code) {
    case 'EACCES': // If permission is denied
      console.error(bind + ' requires elevated privileges.'); // Log the error message
      process.exit(1); // Exit the process with failure code
      break;
    case 'EADDRINUSE': // If the address is already in use
      console.error(bind + ' is already in use.'); // Log the error message
      process.exit(1); // Exit the process with failure code
      break;
    default: // For any other error
      throw error; // Throw the error for further handling
  }
};

// Create the HTTP server using the app
const server = http.createServer(app);

// Attach the error handler to the server
server.on('error', errorHandler);

// Handle the 'listening' event
server.on('listening', () => {
  const address = server.address(); // Get the address the server is listening on
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Determine if it's a named pipe or port
  console.log('Listening on ' + bind); // Log the listening address or port
});

// Start listening on the specified port
server.listen(port);
