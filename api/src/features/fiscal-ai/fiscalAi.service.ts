// FEATURE: fiscal-ai
// Responsabilidade: Consultor tributário a partir da base de dados fiscal
// Fase 3: Busca nos NCMs e regras do banco, retorna resposta estruturada
import { prisma } from '../../lib/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RespostaFiscal {
  resposta: string;
  confianca: 'confirmado' | 'provavel' | 'requerRevisao';
  fontesUtilizadas: Array<{ tipo: string; codigo?: string; descricao: string; lei: string }>;
}

export class FiscalAiService {
  /**
   * Consulta a base fiscal e retorna resposta estruturada com fontes legais.
   * Fase 3: Busca no banco. Fase 4: complementará com Claude API + RAG.
   */
  async consultar(pergunta: string, empresaId: string): Promise<RespostaFiscal> {
    const perguntaLower = pergunta.toLowerCase();

    // 1. Tentar extrair código NCM da pergunta (8 dígitos)
    const ncmMatch = pergunta.match(/\d{4}[.\s]?\d{2}[.\s]?\d{2}/);
    const ncmBusca = ncmMatch ? ncmMatch[0].replace(/[.\s]/g, '') : null;

    // 2. Buscar NCM relevante no banco
    const ncmEncontrado = ncmBusca
      ? await prisma.ncm.findUnique({ where: { codigo: ncmBusca }, include: { regrasIcms: { take: 3 } } })
      : await prisma.ncm.findFirst({
          where: {
            OR: [
              { descricao: { contains: this.extrairPalavraChave(perguntaLower), mode: 'insensitive' } },
            ],
            ativo: true,
          },
          include: { regrasIcms: { take: 3 } },
        });

    // 3. Buscar na base de municípios se pergunta tem ISSQN/serviço
    const isServico = /issqn|nfs-e|servi[cç]o|lc 116|lc116/.test(perguntaLower);

    if (ncmEncontrado) {
      const aliqIpi = Number(ncmEncontrado.aliquotaIpi);
      const fontes: RespostaFiscal['fontesUtilizadas'] = [
        {
          tipo: 'NCM',
          codigo: ncmEncontrado.codigo,
          descricao: ncmEncontrado.descricao,
          lei: ncmEncontrado.fonteLegal,
        },
      ];

      // Adicionar regras de ICMS encontradas
      ncmEncontrado.regrasIcms.forEach((r: any) => {
        fontes.push({
          tipo: 'ICMS',
          descricao: `Alíquota ${Number(r.aliquota)}% (${r.ufOrigem}→${r.ufDestino}) - ${r.tipoOperacao}`,
          lei: r.fonteLegal,
        });
      });

      return {
        resposta: `**NCM ${ncmEncontrado.codigo} — ${ncmEncontrado.descricao}**\n\n` +
          `▸ **IPI:** ${aliqIpi === 0 ? 'Isento (0%)' : `${aliqIpi}%`}\n` +
          `▸ **Unidade tributável:** ${ncmEncontrado.unidadeTributavel}\n` +
          (ncmEncontrado.regrasIcms.length > 0
            ? `\n**Alíquotas ICMS encontradas:**\n` +
              ncmEncontrado.regrasIcms.map((r: any) => `• ${r.ufOrigem}→${r.ufDestino}: ${Number(r.aliquota)}%`).join('\n')
            : '\nAdicione regras de ICMS na base para obter alíquotas interestaduais.'),
        confianca: 'confirmado',
        fontesUtilizadas: fontes,
      };
    }

    // 4. Resposta padrão para serviços / ISSQN
    if (isServico) {
      const servico = await prisma.servico.findFirst({
        where: { empresaId },
      });

      return {
        resposta:
          'Serviços são tributados pelo **ISSQN** conforme a **LC 116/2003**.\n\n' +
          'A alíquota varia de **2% a 5%** conforme o município e a lista de serviços.\n\n' +
          (servico
            ? `Seu serviço cadastrado "${servico.nome}" tem alíquota de ${Number(servico.aliquotaISSQN)}%.`
            : 'Cadastre seus serviços para obter a alíquota exata.'),
        confianca: 'confirmado',
        fontesUtilizadas: [
          { tipo: 'Lei', descricao: 'Lei Complementar 116/2003 — ISSQN', lei: 'LC 116/2003' },
        ],
      };
    }

    // 5. Integração com Gemini Flash (Google AI)
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          systemInstruction: 'Você é um especialista tributário brasileiro. Responda de forma objetiva, citando a legislação aplicável e evite textos introdutórios.' 
        });
        
        const result = await model.generateContent(pergunta);
        const responseText = result.response.text();
        
        return {
          resposta: responseText ? responseText.trim() : 'Sem resposta do assistente.',
          confianca: 'provavel',
          fontesUtilizadas: [{ tipo: 'IA', descricao: 'Análise gerada pelo Gemini Flash (IA) com base na legislação geral', lei: 'Diversas' }]
        };
      } catch (error) {
        console.error('Erro ao consultar Claude API:', error);
        // Fallback genérico se a API falhar
        return {
          resposta: 'Houve um erro de comunicação com a Inteligência Artificial. Tente reformular a pergunta ou verificar a NCM na Receita Federal.',
          confianca: 'requerRevisao',
          fontesUtilizadas: []
        };
      }
    }

    // Fallback genérico (se não houver chave do Gemini)
    return {
      resposta:
        'Não encontrei informações específicas na base fiscal para essa consulta.\n\n' +
        'Configure a chave da API do Google Gemini para obter uma análise com Inteligência Artificial.',
      confianca: 'requerRevisao',
      fontesUtilizadas: [],
    };
  }

  async salvarConsulta(empresaId: string, pergunta: string, resposta: RespostaFiscal) {
    return prisma.consultaFiscalIA.create({
      data: {
        empresaId,
        pergunta,
        resposta: resposta.resposta,
        fontesUtilizadas: resposta.fontesUtilizadas,
        confianca: resposta.confianca,
      },
    });
  }

  private extrairPalavraChave(texto: string): string {
    const stopWords = ['qual', 'o', 'a', 'para', 'de', 'do', 'da', 'tem', 'ncm', 'ipi', 'icms'];
    const words = texto.split(/\s+/).filter(w => w.length > 3 && !stopWords.includes(w));
    return words[0] ?? texto.slice(0, 20);
  }
}
