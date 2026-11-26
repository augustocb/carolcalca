import type { ReactNode } from "react";
import { asset } from "@/lib/site";
import { SITE, metadados } from "@/lib/seo";

// padrão do site; cada página troca título, descrição e endereço oficial (lib/seo.ts)
// (sem endereço canônico aqui: cada página declara o seu; a 404 não tem)
const { alternates, ...padrao } = metadados({ titulo: "Carol Calcavecchia — fotógrafa e filmmaker", capa: true, caminho: "/",
  descricao: "Portfolio e prints de Carolina Calcavecchia, fotógrafa e filmmaker no Rio de Janeiro." });
export const metadata = { metadataBase: new URL(SITE), ...padrao, openGraph: { ...padrao.openGraph, url: undefined } };

const ANALYTICS = `if (location.hostname === "carolcalcavecchia.com") {
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", '{"token": "e3d9592c3a5147a8ab8c4f4803d04b88"}');
  document.head.appendChild(s);
}`;

/* suppressHydrationWarning: o topbar.js grava medidas no <html> antes do React assumir a página. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* ícone "CC" (o segundo em negrito, como no logo) */}
        <link rel="icon" href={asset("/favicon.svg")} type="image/svg+xml" />
        <link rel="icon" href={asset("/favicon.ico")} sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href={asset("/apple-touch-icon.png")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@200;300;400;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={asset("/css/style.css")} />
        {/* precisa rodar antes da página aparecer (transições entre páginas) */}
        <script src={asset("/js/transicao.js")}></script>
        <script src={asset("/js/topbar.js")} defer></script>
        {/* estatísticas de visitas (Cloudflare Web Analytics: sem cookies). Só conta no domínio
            do site, não nos testes locais; o painel do Tina (/admin) não usa este layout. */}
        <script dangerouslySetInnerHTML={{ __html: ANALYTICS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
