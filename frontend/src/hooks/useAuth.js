import { useState, useEffect } from 'react';
import authStore from '../store/authStore';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.token && !!authState.user,
    setAuth: (data) => authStore.setAuth(data),
    logout: () => authStore.clearAuth(),
  };
};
