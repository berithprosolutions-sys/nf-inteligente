import { axiosClient as api } from '@/shared/lib/axiosClient';

export interface Licenca {
  status: 'TRIAL' | 'ATIVA' | 'SUSPENSA' | 'CANCELADA' | 'EXPIRADA';
  plano: 'MENSAL' | 'ANUAL' | null;
  trialExpiraEm: string;
  assinaturaExpiraEm: string | null;
  licenseKey: string | null;
  diasRestantesTrial: number;
}

export const assinaturaService = {
  async consultarLicenca(): Promise<Licenca> {
    const { data } = await api.get('/assinatura/licenca');
    return data;
  },

  async gerarCheckout(plano: 'MENSAL' | 'ANUAL'): Promise<{ checkoutUrl: string }> {
    const { data } = await api.post('/assinatura/checkout', { plano });
    return data;
  },
};
