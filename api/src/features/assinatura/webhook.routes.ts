import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { randomUUID } from 'crypto';

export async function webhookRoutes(fastify: FastifyInstance) {

  /**
   * POST /webhook/asaas
   * Recebe notificações do gateway sobre pagamentos e assinaturas
   */
  fastify.post('/webhook/asaas', async (req, reply) => {
    // 1. Validar token de segurança do webhook
    const tokenRecebido = req.headers['asaas-access-token'];
    if (tokenRecebido !== process.env.ASAAS_WEBHOOK_TOKEN) {
      fastify.log.warn('[Webhook Asaas] Tentativa de acesso com token inválido');
      return reply.status(401).send({ error: 'Não autorizado' });
    }

    const body = req.body as any;
    const evento = body.event;
    const pagamento = body.payment;
    const assinatura = body.subscription;

    // Responder 200 imediatamente para o Asaas não reenviar
    reply.status(200).send({ success: true });

    // 2. Processar de forma assíncrona para não travar o loop do Fastify
    setImmediate(async () => {
      try {
        await processarEventoAsaas({ evento, pagamento, assinatura });
      } catch (err: any) {
        console.error('[Webhook Asaas] Erro fatal no processamento:', err.message);
      }
    });
  });
}

async function processarEventoAsaas({
  evento,
  pagamento,
  assinatura,
}: {
  evento: string;
  pagamento?: any;
  assinatura?: any;
}) {
  console.log(`[Webhook Asaas] Evento: ${evento}`);

  // ── Pagamento CONFIRMADO ────────────────────────────────────
  if (evento === 'PAYMENT_RECEIVED' || evento === 'PAYMENT_CONFIRMED') {
    if (!pagamento) return;

    // Recuperar empresa pelo externalReference que enviamos no checkout
    const empresaId = pagamento.externalReference;
    if (!empresaId) {
      console.warn('[Webhook Asaas] Pagamento ignorado: sem externalReference');
      return;
    }

    // Idempotência: verificar se este pagamento já ativou a licença
    const licencaAtual = await prisma.licenca.findUnique({ where: { empresaId } });
    if (licencaAtual?.asaasEventIdProcessado === pagamento.id) {
      console.log('[Webhook Asaas] Evento duplicado ignorado');
      return;
    }

    // Calcular plano (simples check por valor ou info do pagamento)
    const valorMensal = parseFloat(process.env.PLANO_MENSAL_VALOR || '97.00');
    const eAnual = pagamento.value >= valorMensal * 8; // Heurística simples
    const plano = eAnual ? 'ANUAL' : 'MENSAL';

    // Novo vencimento
    const agora = new Date();
    const vencimento = new Date(agora);
    if (plano === 'MENSAL') vencimento.setMonth(vencimento.getMonth() + 1);
    else vencimento.setFullYear(vencimento.getFullYear() + 1);

    // ATIVAR LICENÇA
    await prisma.licenca.update({
      where: { empresaId },
      data: {
        status: 'ATIVA',
        plano,
        licenseKey: randomUUID(), // Atualiza a chave de licença visual
        assinaturaExpiraEm: vencimento,
        asaasSubscriptionId: pagamento.subscription || null,
        asaasEventIdProcessado: pagamento.id,
      },
    });

    console.log(`[Webhook Asaas] ✅ Licença ATIVADA para ${empresaId} (${plano})`);
  }

  // ── Falhas e Cancelamentos ───────────────────────────────────
  if (evento === 'PAYMENT_OVERDUE' || evento === 'PAYMENT_DUNNING_RECEIVED') {
    const empresaId = pagamento?.externalReference;
    if (empresaId) {
      await prisma.licenca.update({
        where: { empresaId },
        data: { status: 'SUSPENSA' },
      });
      console.log(`[Webhook Asaas] ⚠️ Licença SUSPENSA para ${empresaId}`);
    }
  }

  if (evento === 'SUBSCRIPTION_INACTIVATED' || evento === 'SUBSCRIPTION_DELETED') {
    const empresaId = assinatura?.externalReference;
    if (empresaId) {
      await prisma.licenca.update({
        where: { empresaId },
        data: { status: 'CANCELADA' },
      });
      console.log(`[Webhook Asaas] 🛑 Assinatura CANCELADA para ${empresaId}`);
    }
  }
}
