"use client";
import { useEffect, useRef, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import SiteHeader from "./SiteHeader";
import RichText from "./RichText";
import Lightbox, { type Zoom } from "./Lightbox";
import { asset } from "@/lib/site";

/* Card de preço: a moldura aparece como acréscimo e vale para qualquer impressão. */
function Card({ foto, retrato }: { foto: any; retrato: boolean }) {
  if (!foto.tipo || foto.tipo === "nenhum") return null;
  const fineArt = foto.fineArt ?? 200;
  const moldura = foto.moldura ?? 240;
  return (
    <div className="price">
      <div className={`size${retrato ? " retrato" : ""}`} data-tina-field={tinaField(foto, "tamanho")}>{foto.tamanho}</div>
      <dl>
        {foto.titulo && <dt className="title" data-tina-field={tinaField(foto, "titulo")}>{foto.titulo}</dt>}
        <dt className="head">impressão</dt>
        {foto.tipo !== "fineart" && (<><dt>fotográfica</dt><dd>R$ 120</dd></>)}
        <dt>fine art</dt><dd data-tina-field={tinaField(foto, "fineArt")}>R$ {fineArt}</dd>
        <dt className="strong">moldura</dt>
        <dd className="strong-val" data-tina-field={tinaField(foto, "moldura")}>+ R$ {moldura}</dd>
        {foto.nota && <dt className="note" data-tina-field={tinaField(foto, "nota")}>{foto.nota}</dt>}
      </dl>
    </div>
  );
}

function Foto({ foto, mostrar, onToque }: { foto: any; mostrar: boolean; onToque: (retrato: boolean) => void }) {
  const img = useRef<HTMLImageElement>(null);
  const [retrato, setRetrato] = useState(false);
  const medir = () => img.current?.naturalWidth && setRetrato(img.current.naturalHeight > img.current.naturalWidth);
  useEffect(() => { if (img.current?.complete) medir(); }, [foto.imagem]);
  const ponto = (lado: "antes" | "depois") =>
    foto.ponto?.startsWith(lado) ? <div className={`w${foto.ponto.split("-")[1]} dot`} /> : null;
  return (
    <>
      {ponto("antes")}
      <figure className={`${foto.coluna || "w4"}${mostrar ? " show-price" : ""}`} onClick={() => onToque(retrato)}
        data-tina-field={tinaField(foto)}>
        <img ref={img} src={asset(foto.imagem)} alt={foto.alt || ""} loading="lazy" onLoad={medir} />
        <Card foto={foto} retrato={retrato} />
      </figure>
      {ponto("depois")}
    </>
  );
}

export default function PrintsView(props: { data: any; query: string; variables: any }) {
  const { data } = useTina(props);
  const p = data.prints;
  const [zoom, setZoom] = useState<Zoom>(null);
  const [cardTablet, setCardTablet] = useState<number | null>(null);

  const toque = (i: number, foto: any, retrato: boolean) => {
    // tablet: 1º toque mostra o card (como o mouseover); 2º toque amplia
    const tablet = matchMedia("(hover: none) and (min-width: 701px)").matches;
    if (tablet && cardTablet !== i) return setCardTablet(i);
    setZoom({ src: asset(foto.imagem), alt: foto.alt || "", extra: <Card foto={foto} retrato={retrato} /> });
  };

  return (
    <>
      <SiteHeader atual="prints" />
      <main>
        <h1 className="page-title">prints</h1>
        <section className="prints-notas" data-tina-field={tinaField(p, "notas")}><RichText content={p.notas} /></section>
        <section className="prints">
          {(p.fotos || []).map((foto: any, i: number) => (
            <Foto key={i} foto={foto} mostrar={cardTablet === i} onToque={(r) => toque(i, foto, r)} />
          ))}
        </section>
      </main>
      <Lightbox zoom={zoom} onClose={() => setZoom(null)} />
    </>
  );
}
