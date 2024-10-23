const http = require('http'); // Import the http module
const app = require('./app'); // Import the app module


// Normalize the port number
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Set the port     
const port = normalizePort(process.env.PORT || '3000');

// Set the port to the app
app.set('port', port);

// Handle errors
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // Get the address
  const address = server.address();
  // Get the bind   
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  // Handle the error
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Create the server
const server = http.createServer(app);

// Handle errors
server.on('error', errorHandler);

// Handle listening
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Listen on the port
server.listen(port);
