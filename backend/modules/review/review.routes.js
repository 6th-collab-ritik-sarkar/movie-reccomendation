const express = require('express');
const router = express.Router();
const { 
  addReview, 
  getMovieReviews, 
  getUserReviews, 
  deleteReview 
} = require('./review.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/', protect, addReview);
router.get('/movie/:movieId', getMovieReviews);
router.get('/user', protect, getUserReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
