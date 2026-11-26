import SiteHeader from "@/components/SiteHeader";
import Rodape from "@/components/Rodape";
import { asset } from "@/lib/site";

export const metadata = { title: { absolute: "página não encontrada — Carol Calcavecchia" } };

/* 404 no estilo do site (o GitHub Pages serve este 404.html para endereços que não existem) */
export default function NaoEncontrada() {
  return (
    <>
      <SiteHeader />
      <main className="nao-encontrada">
        <h1>página não encontrada</h1>
        <p>O endereço pode ter mudado. Veja o <a href={asset("/portfolio")}>portfolio</a>, os <a href={asset("/prints")}>prints</a> ou volte para a <a href={asset("/")}>capa</a>.</p>
      </main>
      <Rodape />
    </>
  );
}
