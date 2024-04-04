// src/api/controllers/weatherDataController.js

const WeatherData = require('../models/weatherData');
// Define the cities array and cityCoordinates object at the top of your file

  const cityCoordinates = {
   'Colombo': [79.8612, 6.9271],
   'Kandy': [80.6398, 7.2944],
   'Galle': [80.2155, 6.0413],
   'Jaffna': [80.1440, 9.6457],
   'Kegalle': [80.5000, 7.0000]
  };
  
  // Your existing code for getAllWeatherData, addWeatherData, getCurrentWeatherData, and updateWeatherData functions
  
// Function to get all weather data
exports.getAllWeatherData = async (req, res) => {
 try {
    const weatherData = await WeatherData.find();
    res.status(200).json(weatherData);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
};

// Function to add new weather data
exports.addWeatherData = async (req, res) => {
 const weatherData = new WeatherData({
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    airPressure: req.body.airPressure,
    timestamp: req.body.timestamp,
    location: req.body.location
 });

 try {
    const savedWeatherData = await weatherData.save();
    res.status(201).json(savedWeatherData);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
};

// src/api/controllers/weatherDataController.js

exports.getCurrentWeatherData = async (req, res) => {
   try {
      const weatherData = await WeatherData.aggregate([
        {
          $group: {
            _id: "$location",
            avgTemperature: { $avg: "$temperature" },
            avgHumidity: { $avg: "$humidity" },
            avgAirPressure: { $avg: "$airPressure" },
            lastUpdate: { $max: "$timestamp" }
          }
        }
      ]);
      res.status(200).json(weatherData);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
  };
 
  // Update the route handler to extract parameters from the request body
exports.updateWeatherData = async (req, res) => {
   console.log(req);
   const { city } = req.params; // Extract city from route parameters
   const { temperature, humidity, airPressure } = req.body; // Extract temperature, humidity, and airPressure from request body

   try {
      const updateData = {
          temperature: temperature,
          humidity: humidity,
          airPressure: airPressure,
          timestamp: new Date().toISOString() // Current timestamp
      };
  
      // Update the weather data for the city
      const updatedWeatherData = await WeatherData.findOneAndUpdate(
          { 'location.type': 'Point', 'location.coordinates': cityCoordinates[city] },
          { $set: updateData }, // Use $set to update the specified fields
          { new: true } // This option returns the updated document
      );
  
      if (!updatedWeatherData) {
          console.log(`No weather data found for ${city}.`);
          return res.status(404).json({ message: `No weather data found for ${city}.` });
      } else {
          console.log(`Data for ${city} updated successfully:`, updatedWeatherData);
          return res.status(200).json(updatedWeatherData);
      }
   } catch (error) {
      console.error('Error updating weather data:', error);
      return res.status(500).json({ message: 'Error updating weather data.' });
   }
};
