import { useState, useEffect, useCallback } from 'react';
import authStore from '../store/authStore';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const setAuth = useCallback((data) => authStore.setAuth(data), []);
  const logout = useCallback(() => authStore.clearAuth(), []);
  const setFavorites = useCallback((favs) => authStore.setFavorites(favs), []);
  const setWatchHistory = useCallback((history) => authStore.setWatchHistory(history), []);
  const updateUser = useCallback((user) => authStore.updateUser(user), []);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.token && !!authState.user,
    favorites: authState.favorites || [],
    watchHistory: authState.watchHistory || [],
    setAuth,
    logout,
    setFavorites,
    setWatchHistory,
    updateUser,
  };
};
