import PortfolioView from "@/components/PortfolioView";
import { paginaDoPortfolio, metadadosDoPortfolio } from "@/lib/portfolio";

export const generateMetadata = () => metadadosDoPortfolio("filmes");

export default async function Page() {
  const { res, areas } = await paginaDoPortfolio("filmes");
  return <PortfolioView data={res.data} query={res.query} variables={res.variables} areas={areas} filename="filmes" />;
}
