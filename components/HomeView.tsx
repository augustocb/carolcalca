"use client";
import { useTina, tinaField } from "tinacms/dist/react";
import { capaDoSite } from "@/lib/capa";

export default function HomeView(props: { data: any; query: string; variables: any }) {
  const { data } = useTina(props);
  const home = data.home;
  const capa = capaDoSite(home.capa);

  return (
    <div className="home" style={capa.previa ? { ["--capa-previa" as any]: `url("${capa.previa}")` } : undefined}>
      {/* capa como imagem (não fundo de CSS): o navegador a busca logo, no tamanho certo da tela */}
      <img className="home-capa" src={capa.src} srcSet={capa.srcSet}
        sizes="100vw" alt="" fetchPriority="high" decoding="async"
        data-tina-field={tinaField(home, "capa")} />
      <h1 className="logo">Carol<b>Calcavecchia</b></h1>
      <p className="tagline" data-tina-field={tinaField(home, "tagline")}>{home.tagline}</p>
      <nav>
        <ul className="menu">
          <li><a href="portfolio">portfolio</a></li>
          <li><a href="prints">prints</a></li>
          <li><a href="sobre">sobre</a></li>
        </ul>
      </nav>
    </div>
  );
}
