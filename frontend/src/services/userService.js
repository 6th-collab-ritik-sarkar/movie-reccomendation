import api from './api';

export const getFavorites = async () => {
  const res = await api.get('/user/favorites');
  return res.data;
};

export const addFavorite = async (movie) => {
  const res = await api.post('/user/favorites', movie);
  return res.data;
};

export const removeFavorite = async (movieId) => {
  const res = await api.delete(`/user/favorites/${movieId}`);
  return res.data;
};

export const getWatchHistory = async () => {
  const res = await api.get('/user/history');
  return res.data;
};

export const addToHistory = async (movie) => {
  const res = await api.post('/user/history', movie);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/user/profile');
  return res.data;
};
