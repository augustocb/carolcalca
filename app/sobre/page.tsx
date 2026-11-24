import client from "@/tina/__generated__/client";
import SobreView from "@/components/SobreView";

export const metadata = { title: "sobre — Carol Calcavecchia" };

export default async function Page() {
  const res = await client.queries.sobre({ relativePath: "sobre.json" });
  return <SobreView data={res.data} query={res.query} variables={res.variables} />;
}
