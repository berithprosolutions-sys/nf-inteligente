// FEATURE: Auth
// Responsabilidade: Tipagem do domínio de autenticação
// NÃO faz: Lógica de autenticação com banco real

import { BaseEntity } from '@/shared/types/global.types';

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  role: 'admin' | 'operador' | 'visualizador' | 'OWNER';
  empresaId: string;
}

export interface Empresa extends BaseEntity {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnae?: string;
  regimeTributario: 'SimplesNacional' | 'LucroPresumido' | 'LucroReal' | 'MEI';
  plano: 'starter' | 'pro' | 'business';
  uf?: string;
  municipio?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
}
