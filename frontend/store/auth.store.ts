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

// Estado inicial
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

      // Acción de Login
      login: (token: string, user: User) => {
        // Guardar token en cookie para el middleware
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 días
        
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Acción de Logout
      logout: () => {
        // Limpiar cookie
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        set(initialState);
        // Redirigir al login si estamos en el cliente
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      // Establecer estado de carga
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Verificar si el usuario es admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir ciertos campos
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);