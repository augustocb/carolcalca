import { SITE } from "@/lib/seo";

export const dynamic = "force-static";

/* robots.txt: tudo liberado, menos o painel do Tina; aponta o sitemap */
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
