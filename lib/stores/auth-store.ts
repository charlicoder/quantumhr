import { create } from 'zustand';
import type { User, Permission } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setPermissions: (permissions: Permission[]) => void;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantum-hr-auth', JSON.stringify({ user, token }));
    }
  },

  setPermissions: (permissions) => {
    set({ permissions });
  },

  logout: () => {
    set({ user: null, token: null, permissions: [], isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quantum-hr-auth');
    }
  },

  hasPermission: (resource, action) => {
    const { permissions } = get();
    return permissions.some(
      (p) => p.resource === resource && p.action === action && p.granted
    );
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quantum-hr-auth');
      if (stored) {
        const { user, token } = JSON.parse(stored);
        set({ user, token, isAuthenticated: true });
      }
    }
  },
}));
