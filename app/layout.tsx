import type { ReactNode } from "react";
import { asset } from "@/lib/site";

const titulo = "Carol Calcavecchia — fotógrafa e filmmaker";
const descricao = "Portfolio e prints de Carolina Calcavecchia, fotógrafa e filmmaker no Rio de Janeiro.";

export const metadata = {
  metadataBase: new URL("https://carolcalcavecchia.com"),
  title: titulo,
  description: descricao,
  // prévia ao compartilhar o link (WhatsApp, Instagram, Facebook, LinkedIn, X)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Carol Calcavecchia",
    title: titulo,
    description: descricao,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Carol Calcavecchia — fotógrafa e filmmaker" }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/og.jpg"] },
};

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
      </head>
      <body>{children}</body>
    </html>
  );
}
