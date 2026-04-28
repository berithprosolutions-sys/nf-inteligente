// FEATURE: Fiscal AI
// Responsabilidade: Tipagem e schemas do retorno de respostas estruturadas da IA
// NÃO faz: Prompts locais ou openAI APIs (mock no service)

import { BaseEntity } from '@/shared/types/global.types';

export interface RespostaFiscalIADTO {
  valor: number | null;
  descricao: string;
  fonte: {
    documento: string;
    validoDesde: string;
    url?: string;
  };
  confianca: 'confirmado' | 'provavel' | 'requerRevisao';
}

export interface ConsultaCard extends BaseEntity {
  pergunta: string;
  resposta: string;
  fontesUtilizadas: Record<string, any>;
  confianca: 'confirmado' | 'provavel' | 'requerRevisao';
}
