import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/schemas';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  isAdmin: () => boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (token: string, user: User) => {
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        set(initialState);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);