const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Weather Data API',
        version: '1.0.0',
        description: 'API documentation for Weather Data',
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server',
        },
        {
          url: 'https://nibm-web-api-cw-76a23b3dd18f.herokuapp.com/api-docs/',
          description: 'Production server',
        },
      ],
      components: {
        schemas: {
          WeatherData: {
            type: 'object',
            properties: {
              temperature: {
                type: 'number',
              },
              humidity: {
                type: 'number',
              },
              airPressure: {
                type: 'number',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
              location: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    default: 'Point',
                  },
                  coordinates: {
                    type: 'array',
                    items: {
                      type: 'number',
                    },
                  },
                },
              },
            },
            required: ['temperature', 'humidity', 'airPressure', 'timestamp', 'location'],
          },
         
        },
      },
    },
    apis: ['./routes/*.js'], // Path to the API routes
  };
  
const specs = swaggerJsdoc(options);

module.exports = specs;
