'use strict';

const axios = require('axios');

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

module.exports = getMovieData;
