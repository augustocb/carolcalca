"use client";
import { useEffect, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { capaDoSite } from "@/lib/capa";

const FADE = 1500;   // duração da troca entre as fotos (ms); igual ao CSS de .home-capa

export default function HomeView(props: { data: any; query: string; variables: any }) {
  const { data } = useTina(props);
  const home = data.home;
  const fotos = [home.capa, ...(home.outrasCapas || [])].filter(Boolean).map(capaDoSite);
  const intervalo = Math.max(3, Number(home.intervalo) || 6) * 1000;
  const [atual, setAtual] = useState(0);
  const [anterior, setAnterior] = useState<number | null>(null);
  const [prontas, setProntas] = useState<boolean[]>([]);
  const [pedidas, setPedidas] = useState<boolean[]>([true]);   // fotos que o navegador já pode baixar

  // a cada "intervalo" a próxima foto aparece num fade por cima da atual (só se já carregou;
  // parado com a aba escondida). Terminado o fade, a anterior sai de baixo, sem ser vista.
  const proxima = (atual + 1) % fotos.length;
  useEffect(() => {
    if (anterior !== null) {
      const t = setTimeout(() => setAnterior(null), FADE);
      return () => clearTimeout(t);
    }
    if (fotos.length < 2 || !prontas[proxima]) return;
    const t = setTimeout(() => {
      if (document.hidden) return setProntas((p) => [...p]);   // tenta de novo depois
      setAnterior(atual);
      setAtual(proxima);
    }, intervalo);
    return () => clearTimeout(t);
  }, [atual, proxima, prontas, intervalo, fotos.length, anterior]);

  // só baixa a próxima foto da fila depois que a atual carregou (e enquanto ela está na tela):
  // quem fica pouco na capa baixa no máximo uma foto a mais
  useEffect(() => {
    if (fotos.length > 1 && prontas[atual] && !pedidas[proxima])
      setPedidas((p) => { const n = [...p]; n[proxima] = true; return n; });
  }, [atual, proxima, prontas, pedidas, fotos.length]);

  const carregou = (i: number) => setProntas((p) => { const n = [...p]; n[i] = true; return n; });

  return (
    <div className="home" style={fotos[0]?.previa ? { ["--capa-previa" as any]: `url("${fotos[0].previa}")` } : undefined}>
      {/* capas como imagens (não fundo de CSS): o navegador busca a primeira logo, no tamanho
          certo da tela; as outras entram na página uma de cada vez, quando chega a vez delas */}
      <div className="home-capas" data-tina-field={tinaField(home, "capa")}>
        {fotos.map((f, i) => pedidas[i] && (
          <img key={i} src={f.src} srcSet={f.srcSet} sizes="100vw" alt=""
            className={`home-capa${i === 0 ? " pb" : ""}${i === atual ? " ativa" : i === anterior ? " anterior" : ""}`}
            fetchPriority={i === 0 ? "high" : "low"} decoding="async"
            ref={(el) => { if (el?.complete && el.naturalWidth && !prontas[i]) carregou(i); }}
            onLoad={() => carregou(i)} />
        ))}
      </div>
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
