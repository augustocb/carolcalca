import { preload } from "react-dom";
import client from "@/tina/__generated__/client";
import HomeView from "@/components/HomeView";
import { capaDoSite } from "@/lib/capa";

export default async function Page() {
  const res = await client.queries.home({ relativePath: "home.json" });
  // avisa o navegador, logo no começo da página, para buscar a capa com prioridade alta
  const capa = capaDoSite(res.data.home.capa);
  preload(capa.src, { as: "image", fetchPriority: "high", imageSrcSet: capa.srcSet, imageSizes: "100vw" });
  return <HomeView data={res.data} query={res.query} variables={res.variables} />;
}
