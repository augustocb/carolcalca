import client from "@/tina/__generated__/client";
import SobreView from "@/components/SobreView";

import { metadados, pessoa, jsonLd, textoPuro, SITE } from "@/lib/seo";

export async function generateMetadata() {
  const { data } = await client.queries.sobre({ relativePath: "sobre.json" });
  return metadados({
    titulo: "Sobre a fotógrafa e filmmaker", caminho: "/sobre", seo: data.sobre.seo,
    descricao: textoPuro(data.sobre.bio),   // começo da bio
  });
}

export default async function Page() {
  const res = await client.queries.sobre({ relativePath: "sobre.json" });
  const ld = { "@type": "ProfilePage", url: `${SITE}/sobre`, inLanguage: "pt-BR", mainEntity: pessoa(res.data.sobre) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <SobreView data={res.data} query={res.query} variables={res.variables} />
    </>
  );
}
