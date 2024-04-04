
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const weatherDataRoutes = require('./routes/weatherData');
const authRoutes = require('./routes/auth'); 
const cors = require('cors');
const { fetchToken, updateWeatherData,feedWeatherData } = require('./feedWeatherData');

const app = express();

mongoose.connect("mongodb+srv://yasirrifai30:wYM6U3bkehcIzQXv@cluster0.bsamcsv.mongodb.net/weatherData", { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("Connected to MongoDB");
});

// middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// app.use(authMiddleware);
app.use('/api/auth', authRoutes); 

// Routes
app.use('/api/weatherData', weatherDataRoutes);
// updateWeatherData every 5 mins
fetchToken().then(() => {
    //feedWeatherData();
    setInterval(updateWeatherData, 5 * 60 * 1000);
   }).catch(error => {
    console.error('Failed to fetch token:', error.message);
   });
   
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
