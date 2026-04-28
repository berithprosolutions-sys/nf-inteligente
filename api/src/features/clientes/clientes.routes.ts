// FEATURE: clientes
// Responsabilidade: Rotas HTTP CRUD de clientes (protegidas por JWT)
// NÃO faz: Lógica de banco (ver clientes.service.ts)
import type { FastifyPluginAsync } from 'fastify';
import { ClientesService } from './clientes.service.js';
import { criarClienteSchema, atualizarClienteSchema } from './clientes.schema.js';
import { ok, paginated } from '../../lib/response.js';

export const clientesRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ClientesService();

  // Todas as rotas exigem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // GET /clientes
  fastify.get('/clientes', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const { page = '1', perPage = '20' } = request.query as Record<string, string>;
    const resultado = await service.listar(empresaId, Number(page), Number(perPage));
    return reply.send(paginated(resultado.data, resultado.total, Number(page), Number(perPage)));
  });

  // GET /clientes/:id
  fastify.get<{ Params: { id: string } }>('/clientes/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const cliente = await service.buscarPorId(request.params.id, empresaId);
    return reply.send(ok(cliente));
  });

  // POST /clientes
  fastify.post('/clientes', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = criarClienteSchema.parse(request.body);
    const cliente = await service.criar(empresaId, body);
    return reply.code(201).send(ok(cliente));
  });

  // PUT /clientes/:id
  fastify.put<{ Params: { id: string } }>('/clientes/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = atualizarClienteSchema.parse(request.body);
    const cliente = await service.atualizar(request.params.id, empresaId, body);
    return reply.send(ok(cliente));
  });

  // DELETE /clientes/:id
  fastify.delete<{ Params: { id: string } }>('/clientes/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    await service.deletar(request.params.id, empresaId);
    return reply.code(204).send();
  });
};
