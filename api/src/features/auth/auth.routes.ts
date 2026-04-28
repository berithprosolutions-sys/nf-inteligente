// FEATURE: auth
// Responsabilidade: Rotas HTTP de autenticação
// NÃO faz: Lógica de negócio (ver auth.service.ts)
import type { FastifyPluginAsync } from 'fastify';
import { AuthService } from './auth.service.js';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema.js';
import { AppError } from '../../lib/errors.js';
import { ok } from '../../lib/response.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(fastify);

  // POST /auth/register
  fastify.post('/auth/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const resultado = await service.register(body);
    return reply.code(201).send(ok(resultado));
  });

  // POST /auth/login
  fastify.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const resultado = await service.login(body);
    return reply.send(ok(resultado));
  });

  // POST /auth/refresh
  fastify.post('/auth/refresh', async (request, reply) => {
    const { refreshToken } = refreshSchema.parse(request.body);
    const tokens = await service.refresh(refreshToken);
    return reply.send(ok(tokens));
  });

  fastify.post(
    '/auth/logout',
    { onRequest: [fastify.authenticate] },
    async (_request, reply) => {
      // TODO Fase 3: adicionar token à blacklist no Redis
      return reply.send(ok({ loggedOut: true }));
    }
  );

  // PUT /auth/empresa/:id
  fastify.put(
    '/auth/empresa/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body; // TODO: Validar com schema se tempo permitir
      const resultado = await service.atualizarEmpresa(id, body);
      return reply.send(ok(resultado));
    }
  );
};
