// src/api/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const weatherDataRoutes = require('./routes/weatherData');
const authRoutes = require('./routes/auth'); // Import the auth routes
const cors = require('cors');
const { fetchToken, updateWeatherData,feedWeatherData } = require('./feedWeatherData'); // Adjust the path as necessary

const app = express();

// Connect to MongoDB using the URI from the environment variables
mongoose.connect("mongodb+srv://yasirrifai30:wYM6U3bkehcIzQXv@cluster0.bsamcsv.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("Connected to MongoDB");
});

// Use middleware
app.use(express.json());
// Enable CORS
app.use(cors());
// app.use(authMiddleware); // Apply auth middleware globally
app.use('/api/auth', authRoutes); // Use the auth routes

// Routes
app.use('/api/weatherData', weatherDataRoutes);
// Fetch token and schedule weather data update when the server starts
// After fetching the token, call feedWeatherData
fetchToken().then(() => {
    //feedWeatherData();
    setInterval(updateWeatherData, 1 * 60 * 1000);
   }).catch(error => {
    console.error('Failed to fetch token:', error.message);
   });
   
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
