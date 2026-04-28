// FEATURE: servicos
// Responsabilidade: Schemas, Service e Rotas de serviços (NFS-e)
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { FastifyPluginAsync } from 'fastify';
import { ok, paginated } from '../../lib/response.js';

// ─── Schema ────────────────────────────────────────────────────
export const criarServicoSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  codigoLC116: z.string().optional(),
  lc116Confirmado: z.boolean().default(false),
  aliquotaISSQN: z.number().min(0).max(100).optional(),
  valorPadrao: z.number().positive().optional(),
  unidade: z.string().default('UN'),
});

export type CriarServicoDTO = z.infer<typeof criarServicoSchema>;

// ─── Service ───────────────────────────────────────────────────
class ServicosService {
  async listar(empresaId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.servico.findMany({
        where: { empresaId, deletadoEm: null },
        orderBy: { nome: 'asc' },
        skip,
        take: perPage,
      }),
      prisma.servico.count({ where: { empresaId, deletadoEm: null } }),
    ]);
    return { data, total };
  }

  async buscarPorId(id: string, empresaId: string) {
    const servico = await prisma.servico.findFirst({
      where: { id, empresaId, deletadoEm: null },
    });
    if (!servico) throw new NotFoundError('Serviço');
    return servico;
  }

  async criar(empresaId: string, dto: CriarServicoDTO) {
    return prisma.servico.create({ data: { ...dto, empresaId } });
  }

  async atualizar(id: string, empresaId: string, dto: Partial<CriarServicoDTO>) {
    await this.buscarPorId(id, empresaId);
    return prisma.servico.update({ where: { id }, data: { ...dto, atualizadoEm: new Date() } });
  }

  async deletar(id: string, empresaId: string) {
    await this.buscarPorId(id, empresaId);
    return prisma.servico.update({ where: { id }, data: { deletadoEm: new Date(), ativo: false } });
  }
}

// ─── Routes ────────────────────────────────────────────────────
export const servicosRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ServicosService();
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/servicos', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const { page = '1', perPage = '20' } = request.query as Record<string, string>;
    const resultado = await service.listar(empresaId, Number(page), Number(perPage));
    return reply.send(paginated(resultado.data, resultado.total, Number(page), Number(perPage)));
  });

  fastify.get<{ Params: { id: string } }>('/servicos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    return reply.send(ok(await service.buscarPorId(request.params.id, empresaId)));
  });

  fastify.post('/servicos', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = criarServicoSchema.parse(request.body);
    return reply.code(201).send(ok(await service.criar(empresaId, body)));
  });

  fastify.put<{ Params: { id: string } }>('/servicos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = criarServicoSchema.partial().parse(request.body);
    return reply.send(ok(await service.atualizar(request.params.id, empresaId, body)));
  });

  fastify.delete<{ Params: { id: string } }>('/servicos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    await service.deletar(request.params.id, empresaId);
    return reply.code(204).send();
  });
};
