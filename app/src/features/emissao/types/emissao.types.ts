// FEATURE: Emissao (Wizard de NFe/NFSe)
// Responsabilidade: Manter as tipagens durante o passo-a-passo da emissão
// NÃO faz: Submissão real a SEFAZ ou Prefeitura (Fase 1 focada no visual simulado)

import { BaseEntity, StatusNotaBase } from '@/shared/types/global.types';

export interface ItemNf {
  id: string; // temp id
  produtoId?: string;
  servicoId?: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  ncm?: string;
  impostos: Record<string, any>; // Ex: detalhamento do ICMS simulado
}

export interface EmitirNfeBase {
  clienteId: string;
  itens: ItemNf[];
  naturezaOperacao: string;
}

export interface NotaFiscalEmissaoResponse extends BaseEntity {
  empresaId: string;
  clienteId: string;
  tipo: 'NFe' | 'NFSe';
  status: StatusNotaBase;
  chaveAcesso?: string;
  valorTotal: number;
  simulada?: boolean;
  danfeUrl?: string; // Simulado em memoria
}
