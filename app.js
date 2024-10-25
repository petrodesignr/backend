const express = require('express');
const mongoose = require('mongoose'); 
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const app = express();
const path = require('path');

const uri = "mongodb+srv://test_user:1234Test@cluster0.zho41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection - keep it alive
async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
run();


app.use(express.json());

app.use((req, res, next) => {
  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Allow methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
