'use strict';

console.log('This is my first server');

require('dotenv').config(); // loads environment variables from .env ---- PORT in this case

const express = require('express'); // bringing in express
const cors = require('cors'); // require imports cors allows share info, middleware
const { default: axios } = require('axios');
const app = express(); //using express as dicated in express docs
// const forecastData = require('./data/weather.json'); //constant to reference weather.json data
app.use(cors()); // middleware to share resources across the internet

const PORT = process.env.PORT || 3002; //define port

app.get('/', (request, response) => {
  response.status(200).send('Welcome to our server');
});

app.get('/weather', getForecast);

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
    let date = weatherObject.datetime;
    let lowTemp = weatherObject.low_temp;
    let highTemp = weatherObject.high_temp;
    let weatherDescription = weatherObject.weather.description;

    this.description =`${date}
    low: ${lowTemp} 
    high: ${highTemp}
    ${weatherDescription}.`;
  }
}
// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));
