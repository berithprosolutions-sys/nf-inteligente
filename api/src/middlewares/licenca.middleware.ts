import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function verificarLicenca(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Rotas que não precisam de licença ativa
  const rotasLiberadas = [
    '/auth/login',
    '/auth/register',
    '/webhook/asaas',
    '/assinatura/checkout',
    '/assinatura/licenca',
    '/debug', // Opcional para facilitar testes
    '/auth/splash',
    '/auth/cadastro',
    '/auth/empresa'
  ];

  if (rotasLiberadas.some(r => req.url.startsWith(r))) {
    return;
  }

  // Buscar empresaId do JWT (já injetado pelo middleware de auth)
  const empresaId = (req as any).empresaId;
  if (!empresaId) return; // auth middleware já trata isso

  const licenca = await prisma.licenca.findUnique({
    where: { empresaId },
  });

  if (!licenca) {
    // Se não tiver licença, criamos uma de trial agora como fallback de segurança
    try {
      await prisma.licenca.create({
        data: {
          empresaId,
          status: 'TRIAL',
          trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 dias
        },
      });
    } catch (err: any) {
      // Se deu erro de unique constraint, significa que outra requisição paralela já criou
      if (err.code !== 'P2002') throw err;
    }
    return; // Passa no primeiro acesso após criação
  }

  const agora = new Date();

  // Trial ainda válido
  if (licenca.status === 'TRIAL' && licenca.trialExpiraEm > agora) {
    return; // OK
  }

  // Assinatura ativa e dentro do prazo
  if (
    licenca.status === 'ATIVA' &&
    licenca.assinaturaExpiraEm &&
    licenca.assinaturaExpiraEm > agora
  ) {
    return; // OK
  }

  // Trial expirado — atualizar status se necessário
  if (licenca.status === 'TRIAL' && licenca.trialExpiraEm <= agora) {
    await prisma.licenca.update({
      where: { empresaId },
      data: { status: 'EXPIRADA' },
    });
  }

  // Se chegou aqui, está expirado ou suspenso
  return reply.status(402).send({
    erro: 'licenca_expirada',
    mensagem: 'Seu período de teste ou assinatura expirou. Assine para continuar.',
    status: licenca.status,
    trialExpirouEm: licenca.trialExpiraEm,
  });
}
