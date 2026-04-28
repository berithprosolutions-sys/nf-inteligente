// FEATURE: auth/server
// Responsabilidade: Entry point em função async para compatibilidade CommonJS/ESM
// NÃO faz: Nada além de inicializar o app Fastify corretamente
import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { prisma } from './lib/prisma.js';
import { AppError } from './lib/errors.js';
import { authRoutes } from './features/auth/auth.routes.js';
import { clientesRoutes } from './features/clientes/clientes.routes.js';
import { produtosRoutes } from './features/produtos/produtos.routes.js';
import { servicosRoutes } from './features/servicos/servicos.routes.js';
import { certificadoRoutes } from './features/certificado/certificado.routes.js';
import { emissaoRoutes } from './features/emissao/emissao.routes.js';
import { fiscalAiRoutes } from './features/fiscal-ai/fiscalAi.routes.js';
import { assinaturaRoutes } from './features/assinatura/assinatura.routes.js';
import { webhookRoutes } from './features/assinatura/webhook.routes.js';
import { alertasFiscaisRoutes } from './features/alertas-fiscais/alertas.routes.js';
import { agendarJobDeAlertas, executarColetaDeAlertas } from './features/alertas-fiscais/alertas.job.js';
import { verificarLicenca } from './middlewares/licenca.middleware.js';
import multipart from '@fastify/multipart';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  },
});

// ─── Augment Fastify para incluir o decorator authenticate ───
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const build = async () => {
  await fastify.register(helmet, { global: true });
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-prod',
  });
  await fastify.register(multipart, {
    attachFieldsToBody: false, // Nós iremos recuperar explicitamente via request.file() e request.fields
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB para PFX
  });

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      const payload = request.user as { type?: string, empresaId?: string };
      if (payload.type !== 'access') {
        return reply.code(401).send({ success: false, error: 'Token inválido' });
      }
      // Injeta o empresaId no request para os próximos middlewares
      (request as any).empresaId = payload.empresaId;
    } catch {
      return reply.code(401).send({ success: false, error: 'Não autorizado' });
    }
  });

  // Hook global para verificar licença em todas as rotas protegidas
  fastify.addHook('preHandler', verificarLicenca);

  await fastify.register(authRoutes);
  await fastify.register(clientesRoutes);
  await fastify.register(produtosRoutes);
  await fastify.register(servicosRoutes);
  await fastify.register(certificadoRoutes);
  await fastify.register(emissaoRoutes);
  await fastify.register(fiscalAiRoutes);
  await fastify.register(assinaturaRoutes);
  await fastify.register(webhookRoutes);
  await fastify.register(alertasFiscaisRoutes);

  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  }));

  fastify.setErrorHandler((error, _request, reply) => {
    if (error.name === 'ZodError') {
      return reply.code(422).send({ success: false, error: 'Dados inválidos', details: JSON.parse(error.message) });
    }
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ success: false, error: error.message, code: error.code });
    }
    fastify.log.error(error);
    return reply.code(500).send({ success: false, error: 'Erro interno do servidor' });
  });
};

const start = async () => {
  try {
    await build();
    await prisma.$connect();
    fastify.log.info('✅ Banco de dados conectado');

    agendarJobDeAlertas();
    if (process.env.NODE_ENV !== 'production') {
      executarColetaDeAlertas().catch(console.error);
    }

    const port = Number(process.env.PORT ?? 3001);
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 API rodando em http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  fastify.log.info(`${signal} recebido. Encerrando servidor...`);
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

import type { FastifyRequest, FastifyReply } from 'fastify';

start();
