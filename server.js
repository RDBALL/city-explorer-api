'use strict';

console.log('This is my first server');

require('dotenv').config(); // loads environment variables from .env ---- PORT in this case

const express = require('express'); // bringing in express
const cors = require('cors'); // require imports cors allows share info, middleware
const app = express(); //using express as dicated in express docs
const forecastData = require('./data/weather.json'); //constant to reference weather.json data
app.use(cors()); // middleware to share resources across the internet

const PORT = process.env.PORT || 3002; //define port

console.log(forecastData); //logging to terminal forcastData --- should show all 3 data arrays as objs

app.get('/', (request, response) => {
  console.log('This is showing up in the terminal!');
  response.status(200).send('Welcome to our server');
});

app.get('/forecastData', (request, response) => {
  const searchQuery = request.query.searchQuery;

  console.log(searchQuery); // should return all cities as obj in terminal

  let searchResult = forecastData.find(object => object.city_name === searchQuery);

  console.log(searchResult); // should return city name as an obj with correct data from weather.json

  const result = searchResult.data.map(forecastObj => new Forecast(forecastObj));

  response.status(200).send(result); // send it back to original request

  console.log(result); //should return each day from weather forcast data --- terminal
});

class Forecast {
  constructor(weatherObject) {
    this.datetime = weatherObject.datetime;
    this.description = weatherObject.weather.description;
  }
}

// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));
