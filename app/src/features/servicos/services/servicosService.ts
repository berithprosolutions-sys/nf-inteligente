// FEATURE: servicos/services
// Responsabilidade: CRUD de serviços via API Node.js (axiosClient)
// Migrado de mock local → API REST (Passo 5 do plano de unificação de backend)
import { axiosClient } from '@/shared/lib/axiosClient';
import { Servico } from '../types/servico.types';

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { total: number; page: number; perPage: number; pages: number };
}

interface SingleResponse<T> {
  data: T;
}

export const servicosService = {
  async listar(): Promise<Servico[]> {
    const res = await axiosClient.get<PaginatedResponse<Servico>>('/servicos', {
      params: { perPage: 100 },
    });
    return res.data.data || [];
  },

  async obter(id: string): Promise<Servico> {
    const res = await axiosClient.get<SingleResponse<Servico>>(`/servicos/${id}`);
    return res.data.data;
  },

  async criar(servico: Partial<Servico>): Promise<Servico> {
    const res = await axiosClient.post<SingleResponse<Servico>>('/servicos', servico);
    return res.data.data;
  },

  async atualizar(id: string, servico: Partial<Servico>): Promise<Servico> {
    const res = await axiosClient.put<SingleResponse<Servico>>(`/servicos/${id}`, servico);
    return res.data.data;
  },

  async remover(id: string): Promise<void> {
    await axiosClient.delete(`/servicos/${id}`);
  },
};
