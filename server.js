'use strict';

console.log('This is my first server');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();
const getForecast = require('./modules/getForecast.js');
const getMovieData = require('./modules/getMovieData.js');
app.use(cors());

// --------------------- Setting Routes -----------------------

app.get('/hello', (request, response) => {
  response.status(200).send('Welcome to our server');
});
app.get('/weather', getForecast);
app.get('/movies', getMovieData);

// --------------------- Error Handling -----------------------

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));
