import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

interface AuthState {
  isAuthenticated: boolean;
  usuario: string | null;
  token: string | null;
  rol: string | null;
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      usuario: null,
      token: null,
      rol: null,
      login: async (usuario, password) => {
        try {
          const res = await axiosClient.post('/auth/login', {
            email: usuario,
            password,
          });
          // Forzamos el tipado de la respuesta para evitar errores de acceso
          const data = res.data as { token?: string; user?: { email: string; rol: string } };
          const token = data.token;
          const user = data.user;
          if (!token || !user) {
            set({ isAuthenticated: false, usuario: null, token: null, rol: null });
            return false;
          }
          localStorage.setItem('cajapyme-jwt', token);
          set({ isAuthenticated: true, usuario: user.email, token, rol: user.rol });
          return true;
        } catch {
          set({ isAuthenticated: false, usuario: null, token: null, rol: null });
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem('cajapyme-jwt');
        set({ isAuthenticated: false, usuario: null, token: null, rol: null });
      },
    }),
    { name: 'cajapyme-auth' }
  )
);

export default useAuthStore;
