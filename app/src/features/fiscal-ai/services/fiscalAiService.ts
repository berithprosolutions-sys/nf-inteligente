import { axiosClient } from '@/shared/lib/axiosClient';

export const fiscalAiService = {
  async consultar(pergunta: string) {
    // Integração Real via API Backend
    const { data } = await axiosClient.post('/fiscal/chat', { pergunta });
    return data.data;
  }
};
