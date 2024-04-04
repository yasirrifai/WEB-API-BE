const express = require('express');
const router = express.Router();
const weatherDataController = require('../controllers/weatherData');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, weatherDataController.getAllWeatherData);
router.post('/', authMiddleware, weatherDataController.addWeatherData);
router.get('/current', authMiddleware, weatherDataController.getCurrentWeatherData);
router.patch('/:city', authMiddleware, weatherDataController.updateWeatherData);

module.exports = router;
