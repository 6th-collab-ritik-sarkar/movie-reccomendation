const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchHistory,
  addToWatchHistory,
  getProfile,
} = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/profile', getProfile);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:movieId', removeFavorite);
router.get('/history', getWatchHistory);
router.post('/history', addToWatchHistory);

module.exports = router;
