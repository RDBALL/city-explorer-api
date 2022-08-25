'use strict';

const axios = require('axios');

async function getForecast(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  const weatherAPI = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&days=5&units=I`;
  try {
    const forecastResponse = await axios.get(weatherAPI);
    const forecastArray = forecastResponse.data.data.map(weatherObject => new Forecast(weatherObject));
    response.status(200).send(forecastArray);
  } catch (error) {
    console.log('error message is: ', error);
    response.status(500).send('Server Error!');
  }
}

class Forecast {
  constructor(weatherObject) {
    this.date = weatherObject.datetime;
    let lowTemp = weatherObject.low_temp;
    let highTemp = weatherObject.high_temp;
    let weatherDescription = weatherObject.weather.description;

    this.description =` low: ${lowTemp} high: ${highTemp} with ${weatherDescription}.`;
  }
}

module.exports = getForecast;
