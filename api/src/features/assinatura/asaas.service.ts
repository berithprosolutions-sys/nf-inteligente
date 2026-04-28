import axios from 'axios';

const BASE_URL =
  process.env.ASAAS_ENV === 'sandbox'
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/api/v3';

const asaasHttp = axios.create({
  baseURL: BASE_URL,
  headers: {
    'access_token': process.env.ASAAS_API_KEY!,
    'Content-Type': 'application/json',
  },
});

/**
 * Criar ou recuperar cliente no Asaas
 */
export async function criarClienteAsaas(dados: {
  nome: string;
  cpfCnpj: string;
  email: string;
}) {
  try {
    // Verificar se já existe via busca por documento
    const busca = await asaasHttp.get(
      `/customers?cpfCnpj=${dados.cpfCnpj.replace(/\D/g, '')}`
    );
    
    if (busca.data.data?.length > 0) {
      return busca.data.data[0]; 
    }

    const response = await asaasHttp.post('/customers', {
      name: dados.nome,
      cpfCnpj: dados.cpfCnpj.replace(/\D/g, ''),
      email: dados.email,
      notificationDisabled: true, // Evitar spam do Asaas pro cliente em dev
    });

    return response.data;
  } catch (error: any) {
    console.error('[Asaas Service] Erro ao criar cliente:', error.response?.data || error.message);
    throw new Error('Falha na comunicação com gateway de pagamento');
  }
}

/**
 * Gerar link de checkout para assinatura recorrente
 */
export async function gerarCheckoutAsaas(dados: {
  asaasCustomerId: string;
  plano: 'MENSAL' | 'ANUAL';
  empresaId: string;
}) {
  const valor =
    dados.plano === 'MENSAL'
      ? parseFloat(process.env.PLANO_MENSAL_VALOR || '97.00')
      : parseFloat(process.env.PLANO_ANUAL_VALOR || '797.00');

  const ciclo = dados.plano === 'MENSAL' ? 'MONTHLY' : 'YEARLY';
  const descricao =
    dados.plano === 'MENSAL'
      ? 'NF Inteligente — Assinatura Mensal Boutique'
      : 'NF Inteligente — Assinatura Anual Boutique';

  try {
    // Criar um Link de Pagamento (Checkout)
    const response = await asaasHttp.post('/paymentLinks', {
      name: descricao,
      billingType: 'UNDEFINED', // Deixa o Asaas oferecer Cartão, Pix e Boleto
      chargeType: 'RECURRENT',
      value: valor,
      subscriptionCycle: ciclo,
      description: descricao,
      externalReference: dados.empresaId, // Identificador vital para o webhook
      notificationDisabled: false,
      callback: {
        successUrl: process.env.CHECKOUT_SUCCESS_URL || 'https://berith.app/sucesso',
        autoRedirect: true,
      },
    });

    return {
      checkoutUrl: response.data.url,
      paymentLinkId: response.data.id,
    };
  } catch (error: any) {
    console.error('[Asaas Service] Erro ao gerar checkout:', error.response?.data || error.message);
    throw new Error('Erro ao processar criação de checkout no Asaas');
  }
}

/**
 * Consultar detalhes de uma assinatura
 */
export async function consultarAssinatura(subscriptionId: string) {
  const response = await asaasHttp.get(`/subscriptions/${subscriptionId}`);
  return response.data;
}

/**
 * Cancelar uma assinatura ativa
 */
export async function cancelarAssinatura(subscriptionId: string) {
  await asaasHttp.delete(`/subscriptions/${subscriptionId}`);
}
