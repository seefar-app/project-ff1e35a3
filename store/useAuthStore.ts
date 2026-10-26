import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import type { User } from '@/types';
import { mockUser } from '@/store/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isSubmitting: false,
  authError: null,

  initializeAuth: async () => {
    try {
      await wait(900);
      set({ user: null, isAuthenticated: false, isInitializing: false });
    } catch {
      set({ isInitializing: false });
    }
  },

  login: async (email, password) => {
    set({ isSubmitting: true, authError: null });
    try {
      if (!EMAIL_RE.test(email.trim())) throw new Error('Adresse e-mail invalide.');
      if (password.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
      await wait(800);
      set({ user: { ...mockUser, email: email.trim() }, isAuthenticated: true, isSubmitting: false });
      return true;
    } catch (e) {
      set({ isSubmitting: false, authError: e instanceof Error ? e.message : 'Connexion impossible. Réessayez.' });
      return false;
    }
  },

  signup: async (firstName, lastName, email, password) => {
    set({ isSubmitting: true, authError: null });
    try {
      if (!firstName.trim() || !lastName.trim()) throw new Error('Veuillez renseigner votre nom complet.');
      if (!EMAIL_RE.test(email.trim())) throw new Error('Adresse e-mail invalide.');
      if (password.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
      await wait(1000);
      const user: User = {
        ...mockUser,
        id: Crypto.randomUUID(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        created_at: new Date().toISOString(),
      };
      set({ user, isAuthenticated: true, isSubmitting: false });
      return true;
    } catch (e) {
      set({ isSubmitting: false, authError: e instanceof Error ? e.message : 'Inscription impossible. Réessayez.' });
      return false;
    }
  },

  logout: async () => {
    await wait(200);
    set({ user: null, isAuthenticated: false, authError: null });
  },

  clearError: () => set({ authError: null }),
}));