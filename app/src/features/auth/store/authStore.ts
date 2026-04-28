// FEATURE: auth/store
// Responsabilidade: Estado global de autenticação com tokens JWT
// NÃO faz: Chamadas HTTP (ver authService.ts)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario, Empresa } from '../types/auth.types';

interface AuthState {
  user: Usuario | null;
  empresa: Empresa | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  login: (u: Usuario, e: Empresa, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setEmpresa: (e: Empresa) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      empresa: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,

      login: (user, empresa, tokens) =>
        set({
          user,
          empresa,
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      logout: () =>
        set({
          user: null,
          empresa: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setEmpresa: (empresa) =>
        set({ empresa }),
    }),
    {
      name: 'nf-auth',
      // Nunca persistir tokens em localStorage em produção.
      // Usar SecureStorage do Capacitor — trocar aqui na Fase 3
      partialize: (state) => ({
        user: state.user,
        empresa: state.empresa,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
