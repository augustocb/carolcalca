import client from "@/tina/__generated__/client";
import type { AreaMenu } from "@/components/PortfolioView";

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
