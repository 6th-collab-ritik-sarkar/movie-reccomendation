const omdb = require('../../services/omdb.service');
const groq = require('../../services/groq.service');
const { generatePrompt } = require('../../utils/promptTemplate');
const yts = require('yt-search');

const recommendMovies = async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ success: false, message: 'Mood is required' });
    }

    const prompt = generatePrompt(mood);
    const movieNames = await groq.getMovieRecommendations(prompt);

    if (!movieNames || movieNames.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const moviePromises = movieNames.map((name) => omdb.getMovieByTitle(name));
    const movieResults = await Promise.all(moviePromises);

    // Filter out null results (movies not found in OMDb)
    const filteredMovies = movieResults.filter((m) => m !== null);

    if (filteredMovies.length === 0) {
      return res.status(404).json({ success: false, message: 'No recommendations found' });
    }

    res.json({ success: true, data: filteredMovies });
  } catch (error) {
    console.error('Recommendation error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'AI failed, try again' });
  }
};

const getTrending = async (req, res) => {
  // OMDb doesn't have a direct "trending" endpoint. 
  // We'll use a larger set of high-rated popular movies to populate the home page.
  try {
    const popularTitles = [
      'Inception', 'The Dark Knight', 'Interstellar', 'The Godfather', 
      'Pulp Fiction', 'The Shawshank Redemption', 'The Matrix', 'Fight Club',
      'Forrest Gump', 'The Lord of the Rings: The Fellowship of the Ring',
      'Spirited Away', 'Parasite', 'Gladiator', 'The Lion King', 'Avatar',
      'Joker', 'The Prestige', 'Se7en', 'Whiplash', 'Django Unchained'
    ];
    const moviePromises = popularTitles.map(title => omdb.getMovieByTitle(title));
    const results = await Promise.all(moviePromises);
    res.json({ success: true, data: { results: results.filter(m => m !== null) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { q, page } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query is required' });
    const data = await omdb.searchMovies(q, page || 1);
    res.json({ success: true, data: { results: data.Search, totalResults: data.totalResults } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await omdb.getMovieById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMovieTrailer = async (req, res) => {
  try {
    const { title } = req.params;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Movie title is required' });
    }

    const searchQuery = `${title} official trailer`;
    const searchResult = await yts(searchQuery);

    if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
      return res.status(404).json({ success: false, message: 'Trailer not found' });
    }

    const firstVideo = searchResult.videos[0];
    res.json({
      success: true,
      data: {
        videoId: firstVideo.videoId,
        url: firstVideo.url,
        title: firstVideo.title,
      },
    });
  } catch (error) {
    console.error('Trailer search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { recommendMovies, getTrending, searchMovies, getMovieDetails, getMovieTrailer };
