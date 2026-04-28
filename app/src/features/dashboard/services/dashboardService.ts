import { axiosClient } from '@/shared/lib/axiosClient';

const USE_MOCK = !(import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL
  || (import.meta as unknown as { env: Record<string, string> }).env?.VITE_USE_MOCK === 'true';

export interface DashboardKpis {
  faturamentoMes: number;
  notasEmitidas: number;
  economiaIA: number;
}

export const dashboardService = {
  getKpis: async (): Promise<DashboardKpis> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return {
        faturamentoMes: 78540.00,
        notasEmitidas: 412,
        economiaIA: 2470.50
      };
    }
    const { data } = await axiosClient.get('/dashboard/kpis');
    return data;
  }
};

