// FEATURE: auth/services
// Responsabilidade: Autenticação via API Node.js (JWT puro)
// Migrado de Firebase Auth + Firestore → API REST (Passo 2 do plano)
import axios from 'axios';
import type { Empresa } from '../types/auth.types';

import { Capacitor } from '@capacitor/core';

let BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
if (Capacitor.getPlatform() === 'android' && BASE.includes('localhost')) {
  BASE = BASE.replace('localhost', '10.0.2.2');
}

// Cliente sem interceptor de auth — evita loop em login/register
const apiPublic = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

export interface LoginResponse {
  tokens: { accessToken: string; refreshToken: string };
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
    empresaId: string;
    criadoEm: string;
    atualizadoEm: string;
    empresa: Empresa;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiPublic.post<{ data: LoginResponse }>('/auth/login', {
      email,
      password,
    });
    return data.data;
  },

  async register(payload: {
    nome: string;
    email: string;
    password: string;
    empresa: {
      razaoSocial: string;
      cnpj: string;
      regimeTributario: string;
      uf: string;
      municipio: string;
      codigoMunicipio: string;
    };
  }): Promise<{ success: boolean }> {
    const limpo = {
      ...payload,
      empresa: {
        ...payload.empresa,
        cnpj: payload.empresa.cnpj.replace(/\D/g, ''),
      }
    };
    const { data } = await apiPublic.post<{ data: { success: boolean } }>(
      '/auth/register',
      limpo
    );
    return data.data;
  },

  async logout(): Promise<void> {
    // Logout é local — apenas limpa o store (token stateless JWT)
    // Se a API tiver revogação de token, chamar aqui
  },
};
