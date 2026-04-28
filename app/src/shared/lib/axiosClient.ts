// FEATURE: shared/http
// Responsabilidade: Cliente HTTP centralizado com interceptors de auth
// NÃO faz: Lógica de negócio — é infraestrutura pura
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Capacitor } from '@capacitor/core';

let apiURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Mágica para Emuladores Android: 'localhost' no celular não aponta para o PC. 
// O IP 10.0.2.2 é a ponte nativa do Android pro 'localhost' da máquina de dev!
if (Capacitor.getPlatform() === 'android' && apiURL.includes('localhost')) {
  apiURL = apiURL.replace('localhost', '10.0.2.2');
}

export const axiosClient = axios.create({
  baseURL: apiURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Injeta o Bearer token em toda requisição
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tenta refresh automático em 401
let isRefreshing = false;
let queue: Array<{ resolve: (value: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  queue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data.tokens;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
