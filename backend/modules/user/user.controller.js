const User = require('../../models/User');

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date } = req.body;
    if (!movieId) return res.status(400).json({ success: false, message: 'Movie ID is required' });

    const user = await User.findById(req.user._id);
    const alreadyFav = user.favorites.some((f) => f.movieId === movieId);
    if (alreadyFav) {
      return res.status(400).json({ success: false, message: 'Movie already in favorites' });
    }

    user.favorites.unshift({ movieId, title, poster_path, vote_average, release_date });
    await user.save();
    res.json({ success: true, message: 'Added to favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((f) => f.movieId !== movieId);
    await user.save();
    res.json({ success: true, message: 'Removed from favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user.watchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToWatchHistory = async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date } = req.body;
    if (!movieId) return res.status(400).json({ success: false, message: 'Movie ID is required' });

    const user = await User.findById(req.user._id);
    // Remove if already exists to update timestamp
    user.watchHistory = user.watchHistory.filter((h) => h.movieId !== Number(movieId));
    user.watchHistory.unshift({ movieId: Number(movieId), title, poster_path, vote_average, release_date });

    // Keep max 50 history items
    if (user.watchHistory.length > 50) {
      user.watchHistory = user.watchHistory.slice(0, 50);
    }

    await user.save();
    res.json({ success: true, data: user.watchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        favoritesCount: user.favorites.length,
        watchHistoryCount: user.watchHistory.length,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, getWatchHistory, addToWatchHistory, getProfile };
