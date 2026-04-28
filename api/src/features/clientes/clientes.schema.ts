// FEATURE: clientes
// Responsabilidade: Schema Zod dos DTOs de clientes
// NÃO faz: Lógica de banco (ver clientes.service.ts)
import { z } from 'zod';

const enderecoSchema = z.object({
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string().optional(),
  bairro: z.string(),
  municipio: z.string(),
  codigoMunicipio: z.string().optional(),
  uf: z.string().length(2),
  cep: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  pais: z.string().default('Brasil'),
  codigoPais: z.string().default('1058'),
});

export const criarClienteSchema = z.object({
  tipo: z.enum(['PF', 'PJ']),
  documento: z.string().min(11).max(14),
  nome: z.string().min(2),
  nomeFantasia: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  contribuinteICMS: z.boolean().default(false),
  enderecoCompleto: enderecoSchema.partial(),
});

export const atualizarClienteSchema = criarClienteSchema.partial();

export type CriarClienteDTO = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteDTO = z.infer<typeof atualizarClienteSchema>;
