// FEATURE: Produtos
// Responsabilidade: Tipagem dos elementos de Produto e NCM
// NÃO faz: Lógica fiscal complexa da emissão em si

import { BaseEntity } from '@/shared/types/global.types';

export interface Produto extends BaseEntity {
  empresaId: string;
  nome: string;
  descricao?: string;
  ncm?: string;
  ncmConfirmado: boolean;
  cest?: string;
  unidade: string;
  valorUnitario: number;
  origemMercadoria: string;
  ativo: boolean;
  aliquotaIpi?: number;
  fonteLegal?: string;
}
