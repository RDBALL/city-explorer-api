'use strict';

console.log('This is my first server');

//const getMovieData = require('./modules/moviesAPI.js');
const express = require('express'); // bringing in express
require('dotenv').config(); // loads environment variables from .env ---- PORT in this case
const cors = require('cors'); // require imports cors allows share info, middleware
const axios = require('axios');

const app = express(); //using express as dicated in express docs
const PORT = process.env.PORT || 3002; //define port
// const forecastData = require('./data/weather.json'); //constant to reference weather.json data
app.use(cors()); // middleware to share resources across the internet


app.get('/hello', (request, response) => {
  response.status(200).send('Welcome to our server');
});

// --------------------- setting routes -----------------------

app.get('/weather', getForecast);
app.get('/movies', getMovieData);

// --------------------- creating api functions --------------------

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

async function getMovieData(request, response) {
  let city = request.query.searchQuery;
  const moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
  try{
    const movieDBResponse = await axios.get(moviesAPI);
    const movieArray = movieDBResponse.data.results.map(movieObject => new Movie(movieObject));
    response.status(200).send(movieArray);
  } catch (error) {
    console.log('error message is: ', error);
    response.status(500).send('Server Error!');
  }
}

// --------------------- establishing classes ----------------------

class Forecast {
  constructor(weatherObject) {
    this.date = weatherObject.datetime;
    let lowTemp = weatherObject.low_temp;
    let highTemp = weatherObject.high_temp;
    let weatherDescription = weatherObject.weather.description;

    this.description =` low: ${lowTemp} high: ${highTemp} with ${weatherDescription}.`;
  }
}
//      "poster_path": "/iLWsLVrfkFvOXOG9PbUAYg7AK3E.jpg",

class Movie {
  constructor(movieObject) {
    if (movieObject.poster_path !== null) {
      this.imgUrl = `https://image.tmdb.org/t/p/w500${movieObject.poster_path}`;
    } else {
      this.imgUrl = `https://via.placeholder.com/400x200/000000/ffffff.png?text=No+Poster+Available`;
    }

    this.title = movieObject.title;
    this.overview = movieObject.overview;
    this.release_date = movieObject.release_date;
    this.popularity = movieObject.popularity;
    this.totalVotes = movieObject.vote_count;
    this.vote_avg = movieObject.vote_average;
  }
}

// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));
