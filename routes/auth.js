// src/api/routes/auth.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET; // Use the secret from .env
const bcrypt = require('bcrypt'); // Import bcrypt

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
   
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
       return res.status(400).json({ message: 'User already exists' });
    }
   
    // Create a new user with the hashed password
    const user = new User({ username, password });
    await user.save();
   
    // Generate a JWT for the new user
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
   
    // Send the token in the response
    res.json({ token });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
   
    // Find the user by username
    const user = await User.findOne({ username });
   
    // If the user doesn't exist or the password is incorrect, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
       return res.status(401).json({ message: 'Invalid username or password' });
    }
   
    // Generate a JWT
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
   
    // Send the token in the response
    res.json({ token });
});

module.exports = router;
