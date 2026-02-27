import { create } from 'zustand';

const AUTH_KEY = 'portfolio_auth';

// Static credentials (not exposed in UI)
const ADMIN_USERNAME = 'm-logeshkumar';
const ADMIN_PASSWORD = 'logi2804';

export const useAuthStore = create((set) => ({
  isLoggedIn: localStorage.getItem(AUTH_KEY) === 'true',
  
  login: (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      set({ isLoggedIn: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ isLoggedIn: false });
  }
}));
