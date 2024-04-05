const express = require('express');
const router = express.Router();
const weatherDataController = require('../controllers/weatherData');
const authMiddleware = require('../middleware/auth');
/**
 * @swagger
 * /api/weatherData:
 *   get:
 *     summary: Retrieve all weather data
 *     description: Retrieve all weather data entries from the database.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of weather data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeatherData'
 *   post:
 *     summary: Add new weather data
 *     description: Add a new weather data entry to the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeatherDataInput'
 *     responses:
 *       201:
 *         description: Weather data added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherData'
 *       400:
 *         description: Invalid request body.
 */
router.route('/')
  .get(authMiddleware, weatherDataController.getAllWeatherData)
  .post(authMiddleware, weatherDataController.addWeatherData);

/**
 * @swagger
 * /api/weatherData/current:
 *   get:
 *     summary: Retrieve current weather data
 *     description: Retrieve current weather data for each location.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current weather data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   avgTemperature:
 *                     type: number
 *                   avgHumidity:
 *                     type: number
 *                   avgAirPressure:
 *                     type: number
 *                   lastUpdate:
 *                     type: string
 */
router.get('/current', authMiddleware, weatherDataController.getCurrentWeatherData);

/**
 * @swagger
 * /api/weatherData/{city}:
 *   patch:
 *     summary: Update weather data for a specific city
 *     description: Update weather data for a specific city using its coordinates.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the city to update weather data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               airPressure:
 *                 type: number
 *     responses:
 *       200:
 *         description: Weather data updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherData'
 *       404:
 *         description: No weather data found for the specified city.
 *       500:
 *         description: Error updating weather data.
 */
router.patch('/:city', authMiddleware, weatherDataController.updateWeatherData);


module.exports = router;
