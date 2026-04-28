// FEATURE: core/response
// Responsabilidade: Padronizar o envelope de todas as respostas da API
// NÃO faz: Serialização — o Fastify cuida disso

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true, data, meta };
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
) {
  return {
    success: true,
    data,
    meta: {
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    },
  };
}
