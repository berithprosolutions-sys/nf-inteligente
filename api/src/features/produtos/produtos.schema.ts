// FEATURE: produtos
// Responsabilidade: Schemas Zod dos DTOs de produtos
import { z } from 'zod';
import { OrigemMercadoria } from '@prisma/client';

const origemMercadoriaEnum = z.nativeEnum(OrigemMercadoria);

export const criarProdutoSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  ncm: z.string().regex(/^\d{8}$/, 'NCM deve ter 8 dígitos').optional(),
  ncmConfirmado: z.boolean().default(false),
  cest: z.string().optional(),
  unidade: z.string().default('UN'),
  valorUnitario: z.number().positive(),
  origemMercadoria: origemMercadoriaEnum.default(OrigemMercadoria.CODIGO_0),
  aliquotaIpi: z.number().min(0).max(100).optional(),
  fonteLegal: z.string().optional(),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();

export const atualizarNcmSchema = z.object({
  ncm: z.string().regex(/^\d{8}$/, 'NCM inválido'),
  ncmConfirmado: z.boolean().default(true),
  fonteLegal: z.string().optional(),
  aliquotaIpi: z.number().optional(),
});

export type CriarProdutoDTO = z.infer<typeof criarProdutoSchema>;
export type AtualizarNcmDTO = z.infer<typeof atualizarNcmSchema>;
