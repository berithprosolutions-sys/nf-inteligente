// FEATURE: core/database
// Responsabilidade: Instância global do PrismaClient com lifecycle correto
// NÃO faz: Queries diretamente — use via services de cada feature
import { PrismaClient } from '@prisma/client';

declare global {
  // Previne múltiplas instâncias em hot-reload do tsx
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function criarPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  // Middleware de reconexão automática para o Neon serverless.
  // O Neon fecha conexões inativas (cold start). Ao receber erro
  // de "connection closed", fazemos $connect() e retentamos a query.
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (err: any) {
      const isClosed =
        err?.message?.includes('closed') ||
        err?.code === 'P1001' ||
        err?.code === 'P1017';

      if (isClosed) {
        console.warn('[Prisma] Conexão fechada pelo Neon, reconectando...');
        await client.$connect();
        return await next(params);
      }
      throw err;
    }
  });

  return client;
}

export const prisma = globalThis.__prisma ?? criarPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
