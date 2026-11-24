import type { ReactNode } from "react";
import { asset } from "@/lib/site";

export const metadata = { title: "Carol Calcavecchia — fotógrafa e filmmaker" };

/* suppressHydrationWarning: o topbar.js grava medidas no <html> antes do React assumir a página. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* o site não tem ícone; evita o pedido automático de /favicon.ico */}
        <link rel="icon" href="data:," />
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
