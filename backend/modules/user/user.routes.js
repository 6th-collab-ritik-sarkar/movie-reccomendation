const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchHistory,
  addToWatchHistory,
  getProfile,
  updateProfile,
} = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', upload.single('avatar'), updateProfile);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:movieId', removeFavorite);
router.get('/history', getWatchHistory);
router.post('/history', addToWatchHistory);

module.exports = router;
