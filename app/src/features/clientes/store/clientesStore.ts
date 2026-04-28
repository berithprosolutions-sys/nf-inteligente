import { create } from 'zustand';
import { Cliente } from '../types/cliente.types';
import { clientesService } from '../services/clientesService';

interface ClientesState {
  clientes: Cliente[];
  isLoading: boolean;
  error: string | null;
  setClientes: (clientes: Cliente[]) => void;
  adicionarCliente: (c: Cliente) => void;
  fetchClientes: () => Promise<void>;
}

export const useClientesStore = create<ClientesState>((set) => ({
  clientes: [],
  isLoading: false,
  error: null,
  setClientes: (clientes) => set({ clientes }),
  adicionarCliente: (c) => set((s) => ({ clientes: [...s.clientes, c] })),
  fetchClientes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await clientesService.listar();
      set({ clientes: data });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar clientes' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
