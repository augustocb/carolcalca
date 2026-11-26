import client from "@/tina/__generated__/client";
import PrintsView from "@/components/PrintsView";

import { metadados } from "@/lib/seo";

export async function generateMetadata() {
  const { data } = await client.queries.prints({ relativePath: "prints.json" });
  return metadados({
    titulo: "Prints fine art de fotografia à venda", caminho: "/prints", seo: data.prints.seo,
    descricao: "Fotografias de Carolina Calcavecchia em impressão fine art e fotográfica, com opção de moldura. Escolha a foto e peça o seu print.",
  });
}

export default async function Page() {
  const res = await client.queries.prints({ relativePath: "prints.json" });
  return <PrintsView data={res.data} query={res.query} variables={res.variables} />;
}
