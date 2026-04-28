// FEATURE: produtos
// Responsabilidade: Rotas HTTP CRUD de produtos (protegidas por JWT)
import type { FastifyPluginAsync } from 'fastify';
import { ProdutosService } from './produtos.service.js';
import { criarProdutoSchema, atualizarProdutoSchema, atualizarNcmSchema } from './produtos.schema.js';
import { ok, paginated } from '../../lib/response.js';

export const produtosRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ProdutosService();
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/produtos', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const { page = '1', perPage = '20' } = request.query as Record<string, string>;
    const resultado = await service.listar(empresaId, Number(page), Number(perPage));
    return reply.send(paginated(resultado.data, resultado.total, Number(page), Number(perPage)));
  });

  fastify.get<{ Params: { id: string } }>('/produtos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const produto = await service.buscarPorId(request.params.id, empresaId);
    return reply.send(ok(produto));
  });

  fastify.post('/produtos', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = criarProdutoSchema.parse(request.body);
    const produto = await service.criar(empresaId, body);
    return reply.code(201).send(ok(produto));
  });

  fastify.put<{ Params: { id: string } }>('/produtos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = atualizarProdutoSchema.parse(request.body);
    const produto = await service.atualizar(request.params.id, empresaId, body);
    return reply.send(ok(produto));
  });

  // PATCH específico para confirmação de NCM pela IA
  fastify.patch<{ Params: { id: string } }>('/produtos/:id/ncm', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const body = atualizarNcmSchema.parse(request.body);
    const produto = await service.atualizarNcm(request.params.id, empresaId, body);
    return reply.send(ok(produto));
  });

  fastify.delete<{ Params: { id: string } }>('/produtos/:id', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    await service.deletar(request.params.id, empresaId);
    return reply.code(204).send();
  });
};
