import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { criarClienteAsaas, gerarCheckoutAsaas } from './asaas.service.js';

export async function assinaturaRoutes(fastify: FastifyInstance) {

  // POST /assinatura/checkout — gera link de pagamento
  fastify.post('/assinatura/checkout', {
    onRequest: [fastify.authenticate], 
  }, async (req, reply) => {
    const { plano } = req.body as { plano: 'MENSAL' | 'ANUAL' };
    const empresaId = (req as any).empresaId;

    if (!plano || !['MENSAL', 'ANUAL'].includes(plano)) {
      return reply.status(400).send({ success: false, error: 'Plano inválido. Use MENSAL ou ANUAL.' });
    }

    try {
      // Buscar dados da empresa e primeiro usuário admin
      const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        include: { usuarios: { take: 1, where: { role: 'admin' } } },
      });

      if (!empresa) {
        return reply.status(404).send({ success: false, error: 'Empresa não encontrada.' });
      }

      // 1. Criar ou recuperar cliente no Asaas
      const clienteAsaas = await criarClienteAsaas({
        nome: empresa.razaoSocial,
        cpfCnpj: empresa.cnpj,
        email: empresa.usuarios[0]?.email || 'financeiro@berith.app',
      });

      // 2. Salvar o asaasCustomerId na licença (idempotência suave)
      await prisma.licenca.update({
        where: { empresaId },
        data: { asaasCustomerId: clienteAsaas.id },
      });

      // 3. Gerar link de checkout boutique
      const { checkoutUrl } = await gerarCheckoutAsaas({
        asaasCustomerId: clienteAsaas.id,
        plano,
        empresaId, 
      });

      return reply.send({ success: true, checkoutUrl });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // GET /assinatura/licenca — consultar status da licença atual
  fastify.get('/assinatura/licenca', {
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    const empresaId = (req as any).empresaId;

    const licenca = await prisma.licenca.findUnique({
      where: { empresaId },
      select: {
        status: true,
        plano: true,
        trialExpiraEm: true,
        assinaturaExpiraEm: true,
        licenseKey: true,
      },
    });

    if (!licenca) {
      // Fallback: Gerar trial se não existir (auto-healing)
      const novaLicenca = await prisma.licenca.create({
        data: {
          empresaId,
          status: 'TRIAL',
          trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      });
      return reply.send({ ...novaLicenca, diasRestantesTrial: 7 });
    }

    const agora = new Date();
    const diasRestantesTrial = licenca.trialExpiraEm
      ? Math.max(0, Math.ceil((licenca.trialExpiraEm.getTime() - agora.getTime()) / 86400000))
      : 0;

    return reply.send({
      ...licenca,
      diasRestantesTrial,
    });
  });
}
