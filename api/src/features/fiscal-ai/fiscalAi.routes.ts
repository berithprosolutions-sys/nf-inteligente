// FEATURE: fiscal-ai
// Responsabilidade: Rotas HTTP do consultor tributário IA
import type { FastifyPluginAsync } from 'fastify';
import { FiscalAiService } from './fiscalAi.service.js';
import { ok } from '../../lib/response.js';
import { z } from 'zod';

const consultaSchema = z.object({
  pergunta: z.string().min(5, 'Pergunta muito curta'),
});

export const fiscalAiRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new FiscalAiService();

  fastify.addHook('onRequest', fastify.authenticate);

  // POST /fiscal/chat
  fastify.post('/fiscal/chat', async (request, reply) => {
    const { empresaId } = request.user as { empresaId: string };
    const { pergunta } = consultaSchema.parse(request.body);

    const resposta = await service.consultar(pergunta, empresaId);
    // Salvar log da consulta de forma assíncrona (não bloqueia a resposta)
    service.salvarConsulta(empresaId, pergunta, resposta).catch(() => {});

    return reply.send(ok(resposta));
  });

  // GET /fiscal/ncm/:codigo — consulta direta por código NCM
  fastify.get<{ Params: { codigo: string } }>('/fiscal/ncm/:codigo', async (request, reply) => {
    const { codigo } = request.params;
    const resposta = await service.consultar(`NCM ${codigo}`, (request.user as { empresaId: string }).empresaId);
    return reply.send(ok(resposta));
  });
};
