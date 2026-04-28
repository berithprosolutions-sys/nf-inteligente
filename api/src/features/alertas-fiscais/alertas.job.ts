import cron from 'node-cron';
import { prisma } from '../../lib/prisma.js';
import { buscarNoticiasFiscais, calcularRelevancia } from './newsdata.service.js';

const MAX_ALERTAS_NO_BANCO = 50; // manter só os 50 mais recentes
const RELEVANCIA_MINIMA = 1;     // descartar notícias sem nenhuma palavra fiscal

export async function executarColetaDeAlertas(): Promise<void> {
  console.log('[AlertasJob] Iniciando coleta de notícias fiscais...');

  try {
    const noticias = await buscarNoticiasFiscais();
    console.log(`[AlertasJob] ${noticias.length} notícias coletadas da NewsData.io`);

    let salvas = 0;
    let ignoradas = 0;

    for (const noticia of noticias) {
      const relevancia = calcularRelevancia(
        noticia.title,
        noticia.description
      );

      // Descartar notícias sem relevância fiscal
      if (relevancia < RELEVANCIA_MINIMA) {
        ignoradas++;
        continue;
      }

      // Parsear data de publicação
      let publicadoEm: Date | null = null;
      if (noticia.pubDate) {
        try {
          publicadoEm = new Date(noticia.pubDate);
        } catch {
          publicadoEm = null;
        }
      }

      try {
        // upsert — ignora se URL já existe
        await prisma.alertaFiscal.upsert({
          where: { urlOriginal: noticia.link },
          update: { relevancia }, // atualiza relevância se já existe
          create: {
            titulo: noticia.title,
            resumo: noticia.description,
            urlOriginal: noticia.link,
            urlImagem: noticia.image_url,
            fonte: noticia.source_id,
            autor: noticia.creator?.[0] ?? null,
            categoria: noticia.categoriaLocal as any,
            publicadoEm,
            relevancia,
          },
        });
        salvas++;
      } catch (err) {
        // Ignora erros de constraint (URL duplicada em race condition)
        console.error('[AlertasJob] Erro ao salvar notícia:', err);
      }
    }

    console.log(`[AlertasJob] Resultado: ${salvas} salvas, ${ignoradas} ignoradas por baixa relevância`);

    // Limpar alertas antigos — manter só os MAX_ALERTAS_NO_BANCO mais recentes
    const todos = await prisma.alertaFiscal.findMany({
      orderBy: { coletadoEm: 'desc' },
      select: { id: true },
    });

    if (todos.length > MAX_ALERTAS_NO_BANCO) {
      const idsParaApagar = todos.slice(MAX_ALERTAS_NO_BANCO).map((a) => a.id);
      await prisma.alertaFiscal.deleteMany({
        where: { id: { in: idsParaApagar } },
      });
      console.log(`[AlertasJob] ${idsParaApagar.length} alertas antigos removidos`);
    }

    console.log('[AlertasJob] Coleta finalizada com sucesso.');

  } catch (erro) {
    console.error('[AlertasJob] Erro crítico durante a coleta:', erro);
  }
}

// Agendar para rodar todo dia às 03:00 (horário do servidor)
export function agendarJobDeAlertas(): void {
  cron.schedule('0 3 * * *', () => {
    console.log('[AlertasJob] Disparando coleta programada...');
    executarColetaDeAlertas();
  });

  console.log('[AlertasJob] Job agendado para 03:00 diariamente.');
}
