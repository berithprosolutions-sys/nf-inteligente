// FEATURE: Helpers
// Responsabilidade: Simular latência de rede nos services mockADOS
// NÃO faz: Chamadas HTTP reais

export const mockDelay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));
