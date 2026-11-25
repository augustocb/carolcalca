"use client";
import { useEffect, useRef, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import Rodape from "@/components/Rodape";
import SiteHeader from "./SiteHeader";
import RichText from "./RichText";
import Lightbox, { type Zoom } from "./Lightbox";
import { asset, portfolioHref, videoEmbed } from "@/lib/site";

export type AreaMenu = { filename: string; menu: string; ancoras: { id: string; titulo: string }[] };

const classeArranjo: Record<string, string> = {
  colunas: "pf-gallery",
  retratos: "pf-gallery pf-gallery-retratos",
  familia: "pf-gallery pf-gallery-familia",
  jornadas: "pf-gallery pf-gallery-jornadas",
  feiras: "pf-gallery pf-gallery-feiras",
  destaque: "pf-gallery pf-gallery-destaque",
};

function Galeria({ bloco, ampliar }: { bloco: any; ampliar: (z: Zoom) => void }) {
  const grade = (
    <div className={classeArranjo[bloco.arranjo] || "pf-gallery"} data-tina-field={tinaField(bloco, "fotos")}>
      {(bloco.fotos || []).map((f: any, i: number) => (
        <figure key={i} data-tina-field={tinaField(f)}>
          <img src={asset(f.imagem)} alt={f.alt || ""} loading="lazy"
            onClick={() => ampliar({ src: asset(f.imagem), alt: f.alt || "" })} />
          {f.legenda && <figcaption>{f.legenda}</figcaption>}
        </figure>
      ))}
      {bloco.legenda && bloco.arranjo === "jornadas" && <p className="pf-caption pf-span">{bloco.legenda}</p>}
    </div>
  );
  const legendaFora = bloco.legenda && bloco.arranjo !== "jornadas" ? <p className="pf-caption">{bloco.legenda}</p> : null;
  if (!bloco.titulo && !bloco.ancora) return <>{grade}{legendaFora}</>;
  return (
    <section className="pf-sub" id={bloco.ancora || undefined}>
      {bloco.titulo && <h3 data-tina-field={tinaField(bloco, "titulo")}>{bloco.titulo}</h3>}
      {grade}{legendaFora}
    </section>
  );
}

function Bloco({ bloco, ampliar }: { bloco: any; ampliar: (z: Zoom) => void }) {
  switch (bloco.__typename) {
    case "PortfolioBlocosTexto":
      return <div className="pf-text" data-tina-field={tinaField(bloco, "corpo")}><RichText content={bloco.corpo} /></div>;
    case "PortfolioBlocosFilmes":
      return (
        <>
          {(bloco.itens || []).map((f: any, i: number) => (
            <article className="pf-film pf-film-video" key={i} data-tina-field={tinaField(f)}>
              <div>
                <h3>{f.titulo} {f.ano && <span className="pf-year">({f.ano})</span>}</h3>
                <RichText content={f.descricao} />
              </div>
              {f.video && (
                <div className="pf-video">
                  <iframe src={videoEmbed(f.video)} title={f.titulo} loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
                </div>
              )}
            </article>
          ))}
        </>
      );
    case "PortfolioBlocosLivros":
      return (
        <>
          {(bloco.itens || []).map((l: any, i: number) => (
            <article className="pf-film" key={i} data-tina-field={tinaField(l)}>
              <a className="pf-film-img" href={l.link} target="_blank" rel="noopener">
                <img src={asset(l.capa)} alt={l.capaAlt || ""} loading="lazy" />
              </a>
              <div>
                <h3>{l.titulo}</h3>
                <RichText content={l.descricao} />
                {l.link && <a className="pf-watch" href={l.link} target="_blank" rel="noopener">{l.linkTexto || "saiba mais"}</a>}
              </div>
            </article>
          ))}
        </>
      );
    case "PortfolioBlocosGaleria":
      return <Galeria bloco={bloco} ampliar={ampliar} />;
    default:
      return null;
  }
}

export default function PortfolioView(props: { data: any; query: string; variables: any; areas: AreaMenu[]; filename: string }) {
  const { data } = useTina({ data: props.data, query: props.query, variables: props.variables });
  const area = data.portfolio;
  const [zoom, setZoom] = useState<Zoom>(null);
  const nav = useRef<HTMLElement>(null);
  const [subAtual, setSubAtual] = useState<string | null>(null);

  // subáreas desta página (a partir do conteúdo, para refletir edições na hora)
  const ancoras = (area.blocos || []).filter((b: any) => b?.ancora).map((b: any) => ({ id: b.ancora, titulo: b.titulo || b.ancora }));
  const areas = props.areas.map((a) => (a.filename === props.filename ? { ...a, menu: area.menu || a.menu, ancoras } : a));
  const idx = areas.findIndex((a) => a.filename === props.filename);
  const ant = areas[idx - 1], prox = areas[idx + 1];

  // celular: a faixa de áreas abre rolada até a área atual
  useEffect(() => {
    const atual = nav.current?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (nav.current && atual && nav.current.scrollWidth > nav.current.clientWidth)
      nav.current.scrollTo({ left: atual.offsetLeft - nav.current.clientWidth / 2 + atual.offsetWidth / 2 });
  }, []);

  // marca no menu a subárea que está na tela
  useEffect(() => {
    if (!ancoras.length) return;
    const update = () => {
      let id: string | null = null;
      for (const a of ancoras) {
        const el = document.getElementById(a.id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.3) id = a.id;
      }
      setSubAtual(id);
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => removeEventListener("scroll", update);
  }, [ancoras.map((a: any) => a.id).join()]);

  return (
    <>
      <SiteHeader atual="portfolio" />
      <main className="pf">
        <h1 className="page-title">portfolio</h1>
        <aside className="pf-nav" aria-label="áreas do portfolio" ref={nav}>
          <ul>
            {areas.map((a) => {
              const href = portfolioHref(a.filename);
              const aqui = a.filename === props.filename;
              return (
                <li key={a.filename}>
                  <a href={href} aria-current={aqui ? "page" : undefined}>{a.menu}</a>
                  {a.ancoras.length > 0 && (
                    <ul>
                      {a.ancoras.map((s) => (
                        <li key={s.id}>
                          <a href={`${aqui ? "" : href}#${s.id}`} aria-current={aqui && subAtual === s.id ? "true" : undefined}>
                            {s.titulo.toLowerCase()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="pf-content">
          <section className="pf-section" id={props.filename}>
            <h2 data-tina-field={tinaField(area, "titulo")}>{area.titulo}</h2>
            {(area.blocos || []).map((b: any, i: number) => <Bloco key={i} bloco={b} ampliar={setZoom} />)}
          </section>
          <nav className="pf-pager" aria-label="navegar entre as áreas">
            {ant ? <a className="pf-prev" href={portfolioHref(ant.filename)}>{ant.menu}</a> : <span />}
            {prox ? <a className="pf-next" href={portfolioHref(prox.filename)}>{prox.menu}</a> : <span />}
          </nav>
        </div>
      </main>
      <Rodape />
      <Lightbox zoom={zoom} onClose={() => setZoom(null)} />
    </>
  );
}
