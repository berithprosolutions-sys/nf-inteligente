// FEATURE: auth
// Responsabilidade: Schemas Zod de validação das rotas de autenticação
// NÃO faz: Lógica de negócio (ver auth.service.ts)
import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  empresa: z.object({
    razaoSocial: z.string().min(2),
    cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos numéricos'),
    regimeTributario: z.enum(['MEI', 'SimplesNacional', 'LucroPresumido', 'LucroReal']),
    uf: z.string().length(2, 'UF deve ter 2 caracteres'),
    municipio: z.string().min(2),
    codigoMunicipio: z.string().optional(),
    inscricaoEstadual: z.string().optional(),
    inscricaoMunicipal: z.string().optional(),
    cnae: z.string().optional(),
  }),
});

export const updateEmpresaSchema = z.object({
  razaoSocial: z.string().min(2).optional(),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos numéricos').optional(),
  regimeTributario: z.enum(['MEI', 'SimplesNacional', 'LucroPresumido', 'LucroReal']).optional(),
  uf: z.string().length(2).optional(),
  municipio: z.string().optional(),
  codigoMunicipio: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  cnae: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
