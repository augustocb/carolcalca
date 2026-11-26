import client from "@/tina/__generated__/client";
import type { AreaMenu } from "@/components/PortfolioView";
import { metadados, textoPuro } from "@/lib/seo";
import { portfolioHref } from "@/lib/site";

/** Todas as áreas do portfolio, na ordem do menu, com as subáreas (âncoras) de cada uma. */
export async function areasDoPortfolio(): Promise<AreaMenu[]> {
  const res = await client.queries.portfolioConnection({ first: 100 });
  const docs = (res.data.portfolioConnection.edges || []).map((e: any) => e.node);
  docs.sort((a: any, b: any) => (a.ordem ?? 99) - (b.ordem ?? 99));
  return docs.map((d: any) => ({
    filename: d._sys.filename,
    menu: d.menu || d.titulo,
    ancoras: (d.blocos || []).filter((b: any) => b?.ancora).map((b: any) => ({ id: b.ancora, titulo: b.titulo || b.ancora })),
  }));
}

export async function paginaDoPortfolio(filename: string) {
  const [res, areas] = await Promise.all([
    client.queries.portfolio({ relativePath: `${filename}.json` }),
    areasDoPortfolio(),
  ]);
  return { res, areas };
}

/**
 * Título e descrição de uma área do portfolio. Sem descrição no painel, usa o primeiro texto
 * da página; sem texto, os títulos dos filmes ou livros; senão, uma frase padrão.
 */
export async function metadadosDoPortfolio(filename: string) {
  const { data } = await client.queries.portfolio({ relativePath: `${filename}.json` });
  const p: any = data.portfolio;
  const blocos: any[] = p.blocos || [];
  const texto = blocos.find((b) => b?.__typename?.endsWith("Texto") && b.corpo);
  const itens = blocos.flatMap((b) => (b?.itens || []).map((i: any) => i?.titulo).filter(Boolean));
  const descricao = texto ? textoPuro(texto.corpo)
    : itens.length ? `${p.titulo} de Carolina Calcavecchia: ${itens.join(", ")}.`
    : `${p.titulo} — portfolio de Carolina Calcavecchia, fotógrafa e filmmaker no Rio de Janeiro.`;
  return metadados({ titulo: `${p.titulo} · portfolio`, caminho: `/${portfolioHref(filename)}`, seo: p.seo, descricao });
}
