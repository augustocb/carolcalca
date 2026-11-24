import client from "@/tina/__generated__/client";
import PrintsView from "@/components/PrintsView";

export const metadata = { title: "prints — Carol Calcavecchia" };

export default async function Page() {
  const res = await client.queries.prints({ relativePath: "prints.json" });
  return <PrintsView data={res.data} query={res.query} variables={res.variables} />;
}
