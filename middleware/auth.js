require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const secret = process.env.JWT_SECRET; 

const authMiddleware = (req, res, next) => {
 const token = req.header('Authorization');
 console.log('Token received:', token.replace('Bearer ', '')); 

 if (!token) return res.status(401).send('Access denied. No token provided.');

 try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    console.log('Token decoded:', decoded); 

    req.user = decoded;
    next();
 } catch (ex) {
    console.log('Token:', token);
    console.log('Secret:', secret);
    if (ex instanceof jwt.TokenExpiredError) {
      // Token expired, attempt to refresh it
      refreshToken().then(newToken => {
        if (newToken) {
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
    const newToken = response.data.token; 
    console.log('Token refreshed successfully:', newToken);
    return newToken;
 } catch (error) {
    console.error('Failed to refresh token:', error.message);
    return null;
 }
}

// Schedule the token refresh task
setInterval(refreshToken, 58 * 60 * 1000); 

module.exports = authMiddleware;
