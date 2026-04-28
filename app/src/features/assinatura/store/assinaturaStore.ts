import { create } from 'zustand';
import { Licenca, assinaturaService } from '../services/assinaturaService';

interface AssinaturaStore {
  licenca: Licenca | null;
  carregando: boolean;
  fetchLicenca: () => Promise<void>;
}

export const useAssinaturaStore = create<AssinaturaStore>((set) => ({
  licenca: null,
  carregando: false,

  fetchLicenca: async () => {
    set({ carregando: true });
    try {
      const licenca = await assinaturaService.consultarLicenca();
      set({ licenca });
    } catch {
      set({ licenca: null });
    } finally {
      set({ carregando: false });
    }
  },
}));
