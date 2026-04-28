import { create } from 'zustand';
import { Servico } from '../types/servico.types';
import { servicosService } from '../services/servicosService';

interface ServicosState {
  servicos: Servico[];
  isLoading: boolean;
  error: string | null;
  setServicos: (s: Servico[]) => void;
  fetchServicos: () => Promise<void>;
}

export const useServicosStore = create<ServicosState>((set) => ({
  servicos: [],
  isLoading: false,
  error: null,
  setServicos: (servicos) => set({ servicos }),
  fetchServicos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await servicosService.listar();
      set({ servicos: data });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar serviços' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
