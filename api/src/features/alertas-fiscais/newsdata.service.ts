import axios from 'axios';

const BASE_URL = 'https://newsdata.io/api/1/news';

export interface NoticiaNewsData {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  source_id: string;
  creator: string[] | null;
  pubDate: string | null;
  category: string[] | null;
}

// Queries temáticas para busca fiscal brasileira
const QUERIES_FISCAIS = [
  { q: 'sefaz', categoria: 'NF_E' },
  { q: 'icms', categoria: 'ICMS' },
  { q: '"simples nacional"', categoria: 'SIMPLES_NACIONAL' },
  { q: 'tributária', categoria: 'LEGISLACAO' },
  { q: '"receita federal"', categoria: 'GERAL' },
];

// Palavras-chave para filtrar relevância mínima
const PALAVRAS_RELEVANTES = [
  'fiscal', 'tributário', 'imposto', 'nota fiscal', 'nf-e', 'nfs-e',
  'sefaz', 'receita federal', 'icms', 'iss', 'ipi', 'pis', 'cofins',
  'simples nacional', 'mei', 'cnpj', 'alíquota', 'legislação', 'norma',
  'obrigação', 'declaração', 'ecf', 'sped', 'danfe',
];

export function calcularRelevancia(titulo: string, resumo: string | null): number {
  const texto = `${titulo} ${resumo || ''}`.toLowerCase();
  let pontos = 0;
  for (const palavra of PALAVRAS_RELEVANTES) {
    if (texto.includes(palavra)) pontos += 1;
  }
  return pontos;
}

export function mapearCategoria(queryCategoria: string): string {
  return queryCategoria;
}

export async function buscarNoticiasFiscais(): Promise<
  Array<NoticiaNewsData & { categoriaLocal: string }>
> {
  const todasNoticias: Array<NoticiaNewsData & { categoriaLocal: string }> = [];
  const urlsVistas = new Set<string>();

  for (const queryConfig of QUERIES_FISCAIS) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: process.env.NEWSDATA_API_KEY,
          q: queryConfig.q,
          language: 'pt',
          country: 'br',
          size: 10,
        },
        timeout: 15000,
      });

      if (response.data.status !== 'success') continue;

      const artigos: NoticiaNewsData[] = response.data.results || [];

      for (const artigo of artigos) {
        // Deduplicar por URL
        if (urlsVistas.has(artigo.link)) continue;
        urlsVistas.add(artigo.link);

        todasNoticias.push({
          ...artigo,
          categoriaLocal: queryConfig.categoria,
        });
      }

      // Respeitar rate limit — esperar 500ms entre requests
      await new Promise((r) => setTimeout(r, 500));

    } catch (erro) {
      console.error(`[NewsData] Erro na query "${queryConfig.q}":`, erro);
      // Continua com as próximas queries mesmo se uma falhar
    }
  }

  return todasNoticias;
}
