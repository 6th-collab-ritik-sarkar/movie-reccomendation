import api from './api';

export const addReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getMovieReviews = async (movieId) => {
  const response = await api.get(`/reviews/movie/${movieId}`);
  return response.data;
};

export const getUserReviews = async () => {
  const response = await api.get('/reviews/user');
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};
