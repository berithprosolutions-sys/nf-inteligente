// FEATURE: Servicos
// Responsabilidade: Tipagem para controle de serviços prestados
// NÃO faz: Lógica de emissão em si

import { BaseEntity } from '@/shared/types/global.types';

export interface Servico extends BaseEntity {
  empresaId: string;
  nome: string;
  descricao?: string;
  codigoLC116?: string;
  lc116Confirmado?: boolean;
  aliquotaISSQN?: number;
  valorPadrao?: number;
  unidade?: string;
  ativo: boolean;
}
