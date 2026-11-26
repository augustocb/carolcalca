import { notFound } from "next/navigation";
import PortfolioView from "@/components/PortfolioView";
import { areasDoPortfolio, paginaDoPortfolio, metadadosDoPortfolio } from "@/lib/portfolio";

/* Páginas portfolio-<área> (fotografia, filmmaker, logger…), uma por arquivo em content/portfolio. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const areas = await areasDoPortfolio();
  return areas.filter((a) => a.filename !== "filmes").map((a) => ({ area: `portfolio-${a.filename}` }));
}

type Props = { params: Promise<{ area: string }> };

export async function generateMetadata({ params }: Props) {
  const { area } = await params;
  return metadadosDoPortfolio(area.replace(/^portfolio-/, ""));
}

export default async function Page({ params }: Props) {
  const { area } = await params;
  if (!area.startsWith("portfolio-")) notFound();
  const filename = area.replace(/^portfolio-/, "");
  const { res, areas } = await paginaDoPortfolio(filename);
  return <PortfolioView data={res.data} query={res.query} variables={res.variables} areas={areas} filename={filename} />;
}
