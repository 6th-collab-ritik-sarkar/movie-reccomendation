const axios = require('axios');

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const getMovieByTitle = async (title) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        t: title,
      },
    });

    if (response.data.Response === 'False') {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching movie by title "${title}" from OMDb:`, error.message);
    return null;
  }
};

const getMovieById = async (id) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: id,
      },
    });

    if (response.data.Response === 'False') {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching movie by id "${id}" from OMDb:`, error.message);
    return null;
  }
};

const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
        page: page,
      },
    });

    if (response.data.Response === 'False') {
      return { Search: [], totalResults: "0" };
    }

    return response.data;
  } catch (error) {
    console.error(`Error searching movies for "${query}" from OMDb:`, error.message);
    return { Search: [], totalResults: "0" };
  }
};

module.exports = {
  getMovieByTitle,
  getMovieById,
  searchMovies,
};
