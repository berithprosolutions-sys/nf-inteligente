import { create } from 'zustand';
import { Produto } from '../types/produto.types';
import { produtosService } from '../services/produtosService';

interface ProdutosState {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  setProdutos: (p: Produto[]) => void;
  fetchProdutos: () => Promise<void>;
}

export const useProdutosStore = create<ProdutosState>((set) => ({
  produtos: [],
  isLoading: false,
  error: null,
  setProdutos: (produtos) => set({ produtos }),
  fetchProdutos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await produtosService.listar();
      set({ produtos: data });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar produtos' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
