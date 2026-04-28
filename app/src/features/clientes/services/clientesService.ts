// FEATURE: clientes/services
// Responsabilidade: CRUD de clientes via API Node.js (axiosClient)
// Migrado de Firestore → API REST (Passo 1 do plano de unificação de backend)
import { axiosClient } from '@/shared/lib/axiosClient';
import { Cliente } from '../types/cliente.types';

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { total: number; page: number; perPage: number; pages: number };
}

interface SingleResponse<T> {
  data: T;
}

export const clientesService = {
  async listar(): Promise<Cliente[]> {
    const res = await axiosClient.get<PaginatedResponse<Cliente>>('/clientes', {
      params: { perPage: 100 },
    });
    return res.data.data;
  },

  async obter(id: string): Promise<Cliente> {
    const res = await axiosClient.get<SingleResponse<Cliente>>(`/clientes/${id}`);
    return res.data.data;
  },

  async criar(cliente: Partial<Cliente>): Promise<Cliente> {
    const res = await axiosClient.post<SingleResponse<Cliente>>('/clientes', cliente);
    return res.data.data;
  },

  async atualizar(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const res = await axiosClient.put<SingleResponse<Cliente>>(`/clientes/${id}`, cliente);
    return res.data.data;
  },

  async remover(id: string): Promise<void> {
    await axiosClient.delete(`/clientes/${id}`);
  },
};
