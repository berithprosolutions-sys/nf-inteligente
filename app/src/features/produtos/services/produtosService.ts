// FEATURE: produtos/services
// Responsabilidade: CRUD de produtos via API Node.js (axiosClient)
// Migrado de mock local → API REST (Passo 5 do plano de unificação de backend)
import { axiosClient } from '@/shared/lib/axiosClient';
import { Produto } from '../types/produto.types';

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { total: number; page: number; perPage: number; pages: number };
}

interface SingleResponse<T> {
  data: T;
}

export const produtosService = {
  async listar(): Promise<Produto[]> {
    const res = await axiosClient.get<PaginatedResponse<Produto>>('/produtos', {
      params: { perPage: 100 },
    });
    return res.data.data;
  },

  async obter(id: string): Promise<Produto> {
    const res = await axiosClient.get<SingleResponse<Produto>>(`/produtos/${id}`);
    return res.data.data;
  },

  async criar(produto: Partial<Produto>): Promise<Produto> {
    const res = await axiosClient.post<SingleResponse<Produto>>('/produtos', produto);
    return res.data.data;
  },

  async atualizar(id: string, produto: Partial<Produto>): Promise<Produto> {
    const res = await axiosClient.put<SingleResponse<Produto>>(`/produtos/${id}`, produto);
    return res.data.data;
  },

  async atualizarNcm(
    id: string,
    ncm: string,
    ncmConfirmado: boolean,
    fonteLegal?: string
  ): Promise<Produto> {
    const res = await axiosClient.patch<SingleResponse<Produto>>(`/produtos/${id}/ncm`, {
      ncm,
      ncmConfirmado,
      fonteLegal,
    });
    return res.data.data;
  },

  async remover(id: string): Promise<void> {
    await axiosClient.delete(`/produtos/${id}`);
  },
};
