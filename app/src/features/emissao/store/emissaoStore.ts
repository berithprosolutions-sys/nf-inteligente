// FEATURE: emissao/store
// Responsabilidade: Estado do wizard de emissão de nota fiscal
// NÃO faz: Persistência (apenas memória durante o fluxo)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';
import { ItemNf, NotaFiscalEmissaoResponse } from '../types/emissao.types';

// Storage customizado para Capacitor Preferences (Assíncrono)
const capacitorStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name });
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name });
  },
};

interface EmissaoState {
  tipoNota?: 'NFe' | 'NFSe';
  clienteId?: string;
  servicoId?: string;
  valorServico?: number;
  itens: ItemNf[];
  naturezaOperacao?: string;
  notaEmitida: NotaFiscalEmissaoResponse | null;
  historicoSessao: NotaFiscalEmissaoResponse[];

  setTipoNota: (tipo: 'NFe' | 'NFSe') => void;
  setClienteId: (id: string) => void;
  setServicoId: (id: string) => void;
  setValorServico: (valor: number) => void;
  setNaturezaOperacao: (natureza: string) => void;
  adicionarItem: (item: ItemNf) => void;
  removerItem: (id: string) => void;
  setNotaEmitida: (nota: NotaFiscalEmissaoResponse) => void;
  reset: () => void;
}

export const useEmissaoStore = create<EmissaoState>()(
  persist(
    (set) => ({
      itens: [],
      notaEmitida: null,
      historicoSessao: [],
      setTipoNota: (tipo) => set({ tipoNota: tipo }),
      setClienteId: (id) => set({ clienteId: id }),
      setServicoId: (id) => set({ servicoId: id }),
      setValorServico: (valor) => set({ valorServico: valor }),
      setNaturezaOperacao: (natureza) => set({ naturezaOperacao: natureza }),
      adicionarItem: (item) => set((s) => ({ itens: [...s.itens, item] })),
      removerItem: (id) => set((s) => ({ itens: s.itens.filter(i => i.id !== id) })),
      setNotaEmitida: (nota) => set((s) => ({ 
        notaEmitida: nota,
        historicoSessao: [...s.historicoSessao, nota] 
      })),
      reset: () => set({
        tipoNota: undefined,
        clienteId: undefined,
        servicoId: undefined,
        valorServico: undefined,
        itens: [],
        naturezaOperacao: undefined,
        notaEmitida: null
      }),
    }),
    {
      name: 'emissao-storage',
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state) => ({ 
        historicoSessao: state.historicoSessao,
        notaEmitida: state.notaEmitida 
      }), // Persistir apenas o que é necessário entre sessões
    }
  )
);
