const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
 temperature: Number,
 humidity: Number,
 airPressure: Number,
 timestamp: Date,
 location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } 
 }
});

WeatherDataSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WeatherData', WeatherDataSchema);
