import api from './api';

export const getTrending = async (timeWindow = 'week') => {
  const res = await api.get(`/movies/trending?timeWindow=${timeWindow}`);
  return res.data;
};

export const searchMovies = async (query, page = 1) => {
  const res = await api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};

export const getMovieDetails = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const discoverMovies = async (params) => {
  const res = await api.get('/movies/discover', { params });
  return res.data;
};

export const getGenres = async () => {
  const res = await api.get('/movies/genres');
  return res.data;
};

export const getMoodRecommendations = async (mood) => {
  const res = await api.post('/movies/recommend', { mood });
  return res.data;
};
