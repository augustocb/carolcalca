import PortfolioView from "@/components/PortfolioView";
import { paginaDoPortfolio } from "@/lib/portfolio";

export const metadata = { title: "filmes · portfolio — Carol Calcavecchia" };

export default async function Page() {
  const { res, areas } = await paginaDoPortfolio("filmes");
  return <PortfolioView data={res.data} query={res.query} variables={res.variables} areas={areas} filename="filmes" />;
}
