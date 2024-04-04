require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Import axios for making HTTP requests
const secret = process.env.JWT_SECRET; // Use the secret from .env

const authMiddleware = (req, res, next) => {
 const token = req.header('Authorization');
 console.log('Token received:', token.replace('Bearer ', '')); // Debugging line

 if (!token) return res.status(401).send('Access denied. No token provided.');

 try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    console.log('Token decoded:', decoded); // Debugging line

    req.user = decoded;
    next();
 } catch (ex) {
    console.log('Token:', token);
    console.log('Secret:', secret);
    if (ex instanceof jwt.TokenExpiredError) {
      // Token expired, attempt to refresh it
      refreshToken().then(newToken => {
        if (newToken) {
          // Token refreshed successfully, you might want to store this new token somewhere
          // For demonstration, we'll just log it
          console.log('Token refreshed successfully:', newToken);
        } else {
          console.error('Failed to refresh token.');
        }
      }).catch(error => {
        console.error('Failed to refresh token:', error.message);
      });
      return res.status(401).send('Token expired. Please refresh.');
    } else if (ex instanceof jwt.JsonWebTokenError) {
      return res.status(400).send('Invalid token.');
    }
    console.error('Token verification error:', ex.message);
    res.status(400).send('Invalid token.');
 }
};

async function refreshToken() {
 try {
    const response = await axios.post(`http://localhost:${process.env.PORT}/api/auth/login`, {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    });
    const newToken = response.data.token; // Assuming the token is returned in the response
    console.log('Token refreshed successfully:', newToken);
    return newToken;
 } catch (error) {
    console.error('Failed to refresh token:', error.message);
    return null;
 }
}

// Schedule the token refresh task
setInterval(refreshToken, 58 * 60 * 1000); // 58 minutes in milliseconds

module.exports = authMiddleware;
