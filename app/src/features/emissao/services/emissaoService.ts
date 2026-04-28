// FEATURE: emissao/services
// Responsabilidade: Chamadas HTTP reais para emissão de notas fiscais
// NÃO faz: Lógica de estado (ver emissaoStore.ts)
import { axiosClient } from '@/shared/lib/axiosClient';
import { NotaFiscalEmissaoResponse } from '../types/emissao.types';
import { ItemNf } from '../types/emissao.types';

export interface EmitirNfePayload {
  tipo: 'NFe' | 'NFSe';
  clienteId: string;
  naturezaOperacao: string;
  itens: ItemNf[];
}

export interface DashboardKpis {
  faturamentoMes: number;
  notasEmitidas: number;
  notasEstesMes: number;
  economiaIA: number;
}

const USE_MOCK = !(import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL
  || (import.meta as unknown as { env: Record<string, string> }).env?.VITE_USE_MOCK === 'true';

export const emissaoService = {
  async emitir(payload: EmitirNfePayload): Promise<NotaFiscalEmissaoResponse> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        id: 'mocknf-' + Math.random().toString(36).substring(7),
        chaveAcesso: '35240212345678000199550010000001231000001234',
        status: 'autorizada',
        tipo: payload.tipo,
        empresaId: 'e1',
        clienteId: payload.clienteId,
        valorTotal: payload.itens.reduce((a, i) => a + i.valorTotal, 0),
        simulada: true,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
    }
    const { data } = await axiosClient.post<{ data: NotaFiscalEmissaoResponse }>('/notas/emitir', payload);
    return data.data;
  },

  async listar(): Promise<NotaFiscalEmissaoResponse[]> {
    if (USE_MOCK) return [];
    const { data } = await axiosClient.get<{ data: NotaFiscalEmissaoResponse[] }>('/notas');
    return data.data;
  },

  async buscarPorId(id: string): Promise<NotaFiscalEmissaoResponse> {
    if (USE_MOCK) {
      return {
        id,
        chaveAcesso: '35240212345678000199550010000001231000001234',
        status: 'autorizada',
        tipo: 'NFe',
        empresaId: 'e1',
        clienteId: 'c1',
        valorTotal: 500,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
    }
    const { data } = await axiosClient.get<{ data: NotaFiscalEmissaoResponse }>(`/notas/${id}`);
    return data.data;
  },

  async cancelar(id: string, motivo: string): Promise<NotaFiscalEmissaoResponse> {
    const { data } = await axiosClient.post<{ data: NotaFiscalEmissaoResponse }>(`/notas/${id}/cancelar`, { motivo });
    return data.data;
  },

  async getKpis(): Promise<DashboardKpis> {
    if (USE_MOCK) {
      return { faturamentoMes: 78540, notasEmitidas: 412, notasEstesMes: 23, economiaIA: 2356.20 };
    }
    const { data } = await axiosClient.get<{ data: DashboardKpis }>('/dashboard/kpis');
    return data.data;
  },
};
