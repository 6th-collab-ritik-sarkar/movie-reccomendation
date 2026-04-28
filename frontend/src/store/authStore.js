// Simple auth store using localStorage and custom event emitter
const STORAGE_KEY = 'smartmovie_auth';

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const authStore = {
  _state: getStoredAuth(),
  _listeners: [],

  getState() {
    return this._state;
  },

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  },

  _notify() {
    this._listeners.forEach((l) => l(this._state));
  },

  setAuth({ user, token }) {
    this._state = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    this._notify();
  },

  clearAuth() {
    this._state = { user: null, token: null };
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  },

  getToken() {
    return this._state.token;
  },

  isAuthenticated() {
    return !!this._state.token && !!this._state.user;
  },
};

export default authStore;
