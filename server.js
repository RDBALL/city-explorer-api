'user strict';

console.log('This is my first server');

const {request, response} = require('express');
//servers we use require not import

//Bring in express
const express = require('express');
require('dotenv').config();

//once express is in we need to use it-per express docs
const app = express();

const PORT = process.env.PORT || 3002;

//ROUTES

//Base route - proof of life

app.get('/', (request, response) =>{
  response.status(200).send('Welcome to our server');
});

app.get('/hello', (request, response) => {
  response.status(200).send('This is the hello route');
});


//catch all that needs to be at the bottom. Sends message if user hits 404 error

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT ${PORT}`));
