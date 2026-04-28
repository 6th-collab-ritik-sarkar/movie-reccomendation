const express = require('express');
const router = express.Router();
const { recommendMovies, getTrending, searchMovies, getMovieDetails } = require('./movie.controller');

router.post('/recommend', recommendMovies);
router.get('/trending', getTrending);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
