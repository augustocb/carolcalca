import client from "@/tina/__generated__/client";
import HomeView from "@/components/HomeView";

export default async function Page() {
  const res = await client.queries.home({ relativePath: "home.json" });
  return <HomeView data={res.data} query={res.query} variables={res.variables} />;
}
