import { create } from 'zustand';
import type { User } from '../types/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Rehydrate token from localStorage on first load
  token: localStorage.getItem('sahyog_token'),
  isAuthenticated: !!localStorage.getItem('sahyog_token'),

  setAuth: (user, token) => {
    localStorage.setItem('sahyog_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('sahyog_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));