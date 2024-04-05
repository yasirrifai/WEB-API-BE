

require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET; 
const bcrypt = require('bcrypt'); 

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Username already exists or invalid request body.
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with the provided username and password and generate JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid username or password.
 */
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
