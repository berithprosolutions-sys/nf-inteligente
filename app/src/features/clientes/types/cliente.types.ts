// FEATURE: Clientes
// Responsabilidade: Tipagem para clientes (destinatários das NFs)
// NÃO faz: Lógica de banco de dados do cliente

import { BaseEntity } from '@/shared/types/global.types';

export interface Cliente extends BaseEntity {
  empresaId: string;
  tipo: 'PF' | 'PJ';
  documento: string; // CPF ou CNPJ
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
  enderecoCompleto: Record<string, any>;
  ativo: boolean;
}
