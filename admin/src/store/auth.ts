import { create } from 'zustand';
import { authApi } from '../lib/api';
import type { AdminUser } from '../types/api';

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(payload);
      set({
        user: response.data.data?.user || null,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      set({ user: null, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.me();
      set({
        user: response.data.data?.user || null,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
}));
