import { preload } from "react-dom";
import client from "@/tina/__generated__/client";
import HomeView from "@/components/HomeView";
import { capaDoSite } from "@/lib/capa";
import { metadados, pessoa, jsonLd, SITE, NOME } from "@/lib/seo";

export async function generateMetadata() {
  const { data } = await client.queries.home({ relativePath: "home.json" });
  return metadados({
    titulo: "Carol Calcavecchia — fotógrafa e filmmaker no Rio de Janeiro", capa: true, caminho: "/", seo: data.home.seo,
    descricao: "Carolina Calcavecchia, fotógrafa e filmmaker no Rio de Janeiro: campanhas de moda, retratos, still, performances, filmes e prints fine art à venda.",
  });
}

export default async function Page() {
  const [res, sobre] = await Promise.all([
    client.queries.home({ relativePath: "home.json" }),
    client.queries.sobre({ relativePath: "sobre.json" }),
  ]);
  // avisa o navegador, logo no começo da página, para buscar a capa com prioridade alta
  const capa = capaDoSite(res.data.home.capa);
  preload(capa.src, { as: "image", fetchPriority: "high", imageSrcSet: capa.srcSet, imageSizes: "100vw" });
  // dados estruturados: o site e a pessoa por trás dele
  const ld = { "@graph": [
    { "@type": "WebSite", "@id": `${SITE}/#site`, url: `${SITE}/`, name: NOME, inLanguage: "pt-BR", publisher: { "@id": `${SITE}/#carol` } },
    pessoa(sobre.data.sobre),
  ] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <HomeView data={res.data} query={res.query} variables={res.variables} />
    </>
  );
}
