import { axiosClient as api } from '@/shared/lib/axiosClient';

export interface AlertaFiscal {
  id: string;
  titulo: string;
  resumo: string | null;
  urlOriginal: string;
  urlImagem: string | null;
  fonte: string | null;
  categoria: string;
  publicadoEm: string | null;
  relevancia: number;
}

export const alertasService = {
  async listar(limite = 20): Promise<AlertaFiscal[]> {
    const { data } = await api.get(`/alertas-fiscais?limite=${limite}`);
    return data.alertas;
  },

  async forcarAtualizacao(): Promise<void> {
    await api.post('/alertas-fiscais/atualizar');
  },
};
