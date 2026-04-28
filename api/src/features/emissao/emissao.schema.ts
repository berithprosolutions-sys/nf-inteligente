// FEATURE: emissao
// Responsabilidade: DTOs Zod para emissão de notas fiscais
// NÃO faz: Validação de regras fiscais (ver emissao.service.ts)
import { z } from 'zod';
import { TipoNota } from '@prisma/client';

const itemSchema = z.object({
  produtoId: z.string().uuid().optional().nullable(),
  servicoId: z.string().uuid().optional().nullable(),
  descricao: z.string().min(1),
  quantidade: z.coerce.number().positive(),
  valorUnitario: z.coerce.number().positive(),
  ncm: z.string().optional().nullable(),
  cfop: z.string().optional().nullable(),
  impostos: z.record(z.unknown()).default({}),
});

export const emitirNotaSchema = z.object({
  tipo: z.nativeEnum(TipoNota),
  clienteId: z.string().uuid(),
  naturezaOperacao: z.string().min(3),
  itens: z.array(itemSchema).min(1, 'Adicione ao menos um item'),
});

export type EmitirNotaDTO = z.infer<typeof emitirNotaSchema>;
export type ItemNotaDTO = z.infer<typeof itemSchema>;
