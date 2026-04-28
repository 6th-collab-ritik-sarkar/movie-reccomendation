const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  timeout: 15000,
  params: {
    language: 'en-US',
  },
});

tmdbClient.interceptors.request.use((config) => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    console.warn('TMDB_API_KEY is missing in .env');
    return config;
  }

  if (key.startsWith('eyJ')) {
    // v4 Auth (JWT) - Standard way is just the Bearer token
    config.headers.Authorization = `Bearer ${key}`;
    // Do NOT send api_key in params when using Bearer token to avoid conflicts
  } else {
    // v3 Auth (Standard API Key)
    config.params = { ...config.params, api_key: key };
  }
  return config;
});

// Response interceptor for better error handling
tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TMDB API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.status_message || error.message,
    });
    return Promise.reject(error);
  }
);

const cache = {
  trending: {
    data: null,
    timestamp: 0,
  }
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getTrending = async (timeWindow = 'week') => {
  const now = Date.now();
  if (cache.trending.data && (now - cache.trending.timestamp < CACHE_DURATION)) {
    return cache.trending.data;
  }

  const { data } = await tmdbClient.get(`/trending/movie/${timeWindow}`);
  cache.trending.data = data;
  cache.trending.timestamp = now;
  return data;
};

const searchMovies = async (query, page = 1) => {
  const { data } = await tmdbClient.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};

const getMovieDetails = async (movieId) => {
  const { data } = await tmdbClient.get(`/movie/${movieId}`, {
    params: { append_to_response: 'videos,credits,watch/providers,similar,recommendations' },
  });
  return data;
};

const discoverMovies = async ({ genres, keywords, page = 1 }) => {
  const params = { page, sort_by: 'popularity.desc', include_adult: false };
  if (genres) params.with_genres = genres;
  if (keywords) params.with_keywords = keywords;
  const { data } = await tmdbClient.get('/discover/movie', { params });
  return data;
};

const searchByKeywords = async (keywords, page = 1) => {
  const { data } = await tmdbClient.get('/search/movie', {
    params: { query: keywords, page, include_adult: false },
  });
  return data;
};

const getGenres = async () => {
  const { data } = await tmdbClient.get('/genre/movie/list');
  return data;
};

module.exports = { getTrending, searchMovies, getMovieDetails, discoverMovies, searchByKeywords, getGenres };
