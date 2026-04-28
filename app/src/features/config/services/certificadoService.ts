import { axiosClient } from '@/shared/lib/axiosClient';
import { Preferences } from '@capacitor/preferences';

const USE_MOCK = !(import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL
  || (import.meta as unknown as { env: Record<string, string> }).env?.VITE_USE_MOCK === 'true';

export interface CertificadoStatus {
  temCertificado: boolean;
  vencimento?: string;
  serial?: string;
  subject?: string;
}

export const certificadoService = {
  async getStatus(): Promise<CertificadoStatus> {
    if (USE_MOCK) {
      const { value } = await Preferences.get({ key: 'cert_mock_active' });
      if (value === 'true') {
        return {
          temCertificado: true,
          vencimento: '2027-05-20T23:59:59Z',
          serial: '45A1 BC23 D901 11EF',
          subject: 'BERITH TECNOLOGIA LTDA'
        };
      }
      return { temCertificado: false };
    }
    
    const { data } = await axiosClient.get<{ data: CertificadoStatus }>('/certificado/status');
    return data.data;
  },

  async upload(file: File, senha: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 2000));
      await Preferences.set({ key: 'cert_mock_active', value: 'true' });
      return;
    }

    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('senha', senha);
    await axiosClient.post('/certificado/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async remover(): Promise<void> {
    if (USE_MOCK) {
      await Preferences.remove({ key: 'cert_mock_active' });
      return;
    }
    await axiosClient.delete('/certificado');
  }
};
