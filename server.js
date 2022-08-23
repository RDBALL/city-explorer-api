'user strict';

console.log('This is my first server');


//servers we use require not import

//Bring in express
const express = require('express');
require('dotenv').config();
let data = require('./data/pets.json');
const cors = require('cors');

//once express is in we need to use it-per express docs
const app = express();

//middle ware to share resources across the internet
app.use(cors());

const PORT = process.env.PORT || 3002;

//ROUTES

//Base route - proof of life

app.get('/', (request, response) =>{
  response.status(200).send('Welcome to our server');
});

app.get('/hello', (request, response) => {
  console.log(request.query);
  let firstName = request.query.firstName;
  response.status(200).send(`Hello ${firstName}. This is the hello route`);
});


app.get('/pet', (request, response) => {
  let species = request.query.species;
  // console.log(species);
  let dataToGroom = data.find(pet => pet.species === species);
  let dataToSend = new Pet(dataToGroom);
  response.status(200).send(dataToSend);
});

class Pet {
  constructor(petObj){
    this.name = petObj.name;
    this.breed = petObj.breed;
  }
}

//catch all that needs to be at the bottom. Sends message if user hits 404 error

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.listen(PORT, () => console.log(`We are up on PORT ${PORT}`));
