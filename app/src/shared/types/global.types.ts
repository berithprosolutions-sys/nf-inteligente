// FEATURE: Types Globais
// Responsabilidade: Manter as entidades padronizadas gerais do TS
// NÃO faz: Tipagem contínua de estados locais (use context store)

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface BaseEntity {
  id: string;
  criadoEm: string; // ISO String mapping
  atualizadoEm: string; // ISO String mapping
}

export type StatusNotaBase = 'rascunho' | 'validando' | 'transmitindo' | 'autorizada' | 'rejeitada' | 'cancelada' | 'denegada' | 'emProcessamento';
