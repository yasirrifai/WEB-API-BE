require('dotenv').config(); 
const axios = require('axios');
const cities = [
 'Colombo',
 'Kandy',
 'Galle',
 'Jaffna',
 'Kegalle'
];

let token = ''; 

// Function to fetch token from login API
async function fetchToken() {
 try {
    const response = await axios.post(`http://localhost:${process.env.PORT}/api/auth/login`, {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    });
    token = `Bearer ${response.data.token}`; // Assuming the token is returned in the response
    console.log('Token fetched successfully:', token);
 } catch (error) {
    console.error('Failed to fetch token:', error.message);
 }
}

const baseUrl =`http://localhost:${process.env.PORT}/api/weatherData`;

// Example coordinates for the cities in Sri Lanka. Adjust these as necessary.
const cityCoordinates = {
 'Colombo': [79.8612, 6.9271],
 'Kandy': [80.6398, 7.2944],
 'Galle': [80.2155, 6.0413],
 'Jaffna': [80.1440, 9.6457],
 'Kegalle': [80.5000, 7.0000]
};

async function feedWeatherData() {
 for (const city of cities) {
    const weatherData = {
      temperature: Math.floor(Math.random() * 41), // Random temperature between 0 and 100
      humidity: Math.floor(Math.random() * 100), // Random humidity between 0 and 100
      airPressure: Math.floor(Math.random() * 1000), // Random air pressure between 0 and 1000
      timestamp: new Date().toISOString(), // Current timestamp
      location: {
        type: "Point",
        coordinates: cityCoordinates[city] // Use the coordinates for the city
      }
    };

    try {
      const response = await axios.post(baseUrl, weatherData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      console.log(`Data for ${city} added successfully:`, response.data);
    } catch (error) {
      console.error(`Failed to add data for ${city}:`, error.message);
    }
 }
}

feedWeatherData();
async function updateWeatherData() {
  for (const city of cities) {
     const weatherData = {
       temperature: Math.floor(Math.random() * 41), // Random temperature between 0 and 100
       humidity: Math.floor(Math.random() * 100), // Random humidity between 0 and 100
       airPressure: Math.floor(Math.random() * 1000), // Random air pressure between 0 and 1000
       timestamp: new Date().toISOString(), // Current timestamp
       location: {
         type: "Point",
         coordinates: cityCoordinates[city] // Use the coordinates for the city
       }
     };
 
     try {
       const response = await axios.patch(`${baseUrl}/${city}`, weatherData, {
         headers: {
           'Content-Type': 'application/json',
           'Authorization': token
         }
       });
       console.log(`Data for ${city} updated successfully:`, response.data);
     } catch (error) {
       console.error(`Failed to update data for ${city}:`, error.message);
     }
  }
 }

 module.exports = { fetchToken, feedWeatherData,updateWeatherData };
