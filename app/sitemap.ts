import { SITE } from "@/lib/seo";
import { portfolioHref } from "@/lib/site";
import { areasDoPortfolio } from "@/lib/portfolio";

export const dynamic = "force-static";

/* sitemap.xml: todas as páginas do site, incluindo cada área do portfolio */
export default async function sitemap() {
  const areas = await areasDoPortfolio();
  const agora = new Date();
  return [
    { url: `${SITE}/`, lastModified: agora, priority: 1 },
    ...areas.map((a) => ({ url: `${SITE}/${portfolioHref(a.filename)}`, lastModified: agora, priority: 0.8 })),
    { url: `${SITE}/prints`, lastModified: agora, priority: 0.9 },
    { url: `${SITE}/sobre`, lastModified: agora, priority: 0.7 },
  ];
}
