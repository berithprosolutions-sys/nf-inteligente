// FEATURE: emissao
// Responsabilidade: Rotas HTTP para emissão de notas fiscais (protegidas por JWT)
// NÃO faz: Lógica de negócio (ver emissao.service.ts)
import type { FastifyPluginAsync } from 'fastify';
import { EmissaoService } from './emissao.service.js';
import { emitirNotaSchema } from './emissao.schema.js';
import { ok, paginated } from '../../lib/response.js';

export const emissaoRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new EmissaoService();

  fastify.addHook('onRequest', fastify.authenticate);

  // POST /notas/emitir
  fastify.post('/notas/emitir', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = emitirNotaSchema.parse(request.body);
    const nota = await service.emitir(empresaId, body);
    return reply.code(201).send(ok(nota));
  });

  // GET /notas
  fastify.get('/notas', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const { page = '1', perPage = '20' } = request.query as Record<string, string>;
    const resultado = await service.listar(empresaId, Number(page), Number(perPage));
    return reply.send(paginated(resultado.data, resultado.total, Number(page), Number(perPage)));
  });

  // GET /notas/:id
  fastify.get<{ Params: { id: string } }>('/notas/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const nota = await service.buscarPorId(request.params.id, empresaId);
    return reply.send(ok(nota));
  });

  // POST /notas/:id/cancelar
  fastify.post<{ Params: { id: string }; Body: { motivo: string } }>(
    '/notas/:id/cancelar',
    async (request, reply) => {
      const { empresaId } = request.user as { empresaId: string };
      const { motivo } = request.body;
      const nota = await service.cancelar(request.params.id, empresaId, motivo);
      return reply.send(ok(nota));
    }
  );

  // GET /dashboard/kpis — usada pelo frontend
  fastify.get('/dashboard/kpis', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const kpis = await service.getKpis(empresaId);
    return reply.send(ok(kpis));
  });
};
