import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { executarColetaDeAlertas } from './alertas.job.js';

export async function alertasFiscaisRoutes(fastify: FastifyInstance) {

  // GET /alertas-fiscais — listar alertas (rota pública para usuários logados)
  fastify.get('/alertas-fiscais', {
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    const { limite = '20', categoria } = req.query as {
      limite?: string;
      categoria?: string;
    };

    const where = categoria ? { categoria: categoria as any } : {};

    const alertas = await prisma.alertaFiscal.findMany({
      where,
      orderBy: [
        { relevancia: 'desc' },
        { publicadoEm: 'desc' },
      ],
      take: Math.min(parseInt(limite), 50),
      select: {
        id: true,
        titulo: true,
        resumo: true,
        urlOriginal: true,
        urlImagem: true,
        fonte: true,
        categoria: true,
        publicadoEm: true,
        relevancia: true,
      },
    });

    return reply.send({
      total: alertas.length,
      alertas,
    });
  });

  // POST /alertas-fiscais/atualizar — forçar coleta manual (admin)
  // Útil para testes sem esperar o cron das 03:00
  fastify.post('/alertas-fiscais/atualizar', {
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    // Disparar coleta em background sem bloquear a resposta
    setImmediate(() => executarColetaDeAlertas());

    return reply.send({
      mensagem: 'Coleta iniciada em background. Aguarde alguns segundos.',
    });
  });
}
