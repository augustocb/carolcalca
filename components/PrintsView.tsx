"use client";
import { useEffect, useRef, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import Rodape from "@/components/Rodape";
import SiteHeader from "./SiteHeader";
import RichText from "./RichText";
import Lightbox, { type Zoom } from "./Lightbox";
import PedidoModal from "./PedidoModal";
import { versoesDaFoto, tamanhoNaGrade } from "@/lib/fotos";

/* Card de preço. A linha da moldura só aparece se a foto tiver preço de moldura preenchido. */
function Card({ foto, retrato, onSolicitar }: { foto: any; retrato: boolean; onSolicitar: () => void }) {
  if (!foto.tipo || foto.tipo === "nenhum") return null;
  const fineArt = foto.fineArt ?? 200;
  const moldura = typeof foto.moldura === "number" && foto.moldura > 0 ? foto.moldura : null;
  return (
    // o card inteiro abre o pedido; stopPropagation: não amplia a foto nem fecha o zoom
    <div className="price" onClick={(e) => { e.stopPropagation(); onSolicitar(); }}>
      <div className={`size${retrato ? " retrato" : ""}`} data-tina-field={tinaField(foto, "tamanho")}>{foto.tamanho}</div>
      <dl>
        {foto.titulo && <dt className="title" data-tina-field={tinaField(foto, "titulo")}>{foto.titulo}</dt>}
        <dt className="head">impressão</dt>
        {foto.tipo !== "fineart" && (<><dt>fotográfica</dt><dd>R$ 120</dd></>)}
        <dt>fine art</dt><dd data-tina-field={tinaField(foto, "fineArt")}>R$ {fineArt}</dd>
        {moldura !== null && (
          <>
            <dt className="strong">moldura</dt>
            <dd className="strong-val" data-tina-field={tinaField(foto, "moldura")}>+ R$ {moldura}</dd>
          </>
        )}
        {foto.nota && <dt className="note" data-tina-field={tinaField(foto, "nota")}>{foto.nota}</dt>}
        <dt className="pedir">
          {/* o clique (ou Enter no teclado) sobe para o card, que abre o pedido */}
          <button type="button" className="solicitar">solicitar</button>
        </dt>
      </dl>
    </div>
  );
}

/*
 * Pontos decorativos da grade (8 colunas). Cada foto pode ter um ponto antes ou depois dela.
 * Um ponto só aparece se couber na MESMA linha da sua foto; senão, é omitido. Assim, quando
 * fotos são removidas ou trocadas de lugar no painel, não sobram pontos soltos numa linha sozinhos.
 */
type Pontos = { antes?: number; depois?: number };
function arrumarPontos(fotos: any[]): Pontos[] {
  let linha = 0;                                   // colunas já ocupadas na linha atual
  return fotos.map((f) => {
    const col = Number(String(f.coluna || "w4").slice(1)) || 4;
    const [lado, n] = String(f.ponto || "nenhum").split("-");
    const ponto = Number(n) || 0;
    const r: Pontos = {};
    const antes = lado === "antes" ? ponto : 0;
    if (linha + antes + col > 8) linha = 0;        // a foto (com o ponto) não cabe: começa nova linha
    if (antes && linha + antes + col <= 8) { r.antes = antes; linha += antes; }
    if (linha + col > 8) linha = 0;
    linha += col;
    if (lado === "depois" && ponto && linha + ponto <= 8) { r.depois = ponto; linha += ponto; }
    if (linha >= 8) linha = 0;
    return r;
  });
}

function Foto({ foto, pontos, mostrar, onToque, onSolicitar }: { foto: any; pontos: Pontos; mostrar: boolean; onToque: (retrato: boolean) => void; onSolicitar: () => void }) {
  const img = useRef<HTMLImageElement>(null);
  const [retrato, setRetrato] = useState(false);
  const medir = () => img.current?.naturalWidth && setRetrato(img.current.naturalHeight > img.current.naturalWidth);
  useEffect(() => { if (img.current?.complete) medir(); }, [foto.imagem]);
  const leve = versoesDaFoto(foto.imagem);
  const ponto = (lado: "antes" | "depois") =>
    pontos[lado] ? <div className={`w${pontos[lado]} dot`} /> : null;
  return (
    <>
      {ponto("antes")}
      <figure className={`${foto.coluna || "w4"}${mostrar ? " show-price" : ""}`} onClick={() => onToque(retrato)}
        data-tina-field={tinaField(foto)}>
        {/* versão leve no tamanho da coluna (tools/fotos.mjs); a original pode ter vários MB */}
        <img ref={img} src={leve.src} srcSet={leve.srcSet} sizes={tamanhoNaGrade[foto.coluna || "w4"]}
          alt={foto.alt || ""} loading="lazy" decoding="async" onLoad={medir} />
        <Card foto={foto} retrato={retrato} onSolicitar={onSolicitar} />
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
  const [pedido, setPedido] = useState<any>(null);   // foto do pedido em aberto
  const pontosQueCabem = arrumarPontos(p.fotos || []);

  const toque = (i: number, foto: any, retrato: boolean) => {
    // tablet: 1º toque mostra o card (como o mouseover); 2º toque amplia
    const tablet = matchMedia("(hover: none) and (min-width: 701px)").matches;
    if (tablet && cardTablet !== i) return setCardTablet(i);
    setZoom({ src: versoesDaFoto(foto.imagem).grande, alt: foto.alt || "", extra: <Card foto={foto} retrato={retrato} onSolicitar={() => { setZoom(null); setPedido(foto); }} /> });
  };

  return (
    <>
      <SiteHeader atual="prints" />
      <main>
        <h1 className="page-title">prints</h1>
        <section className="prints-notas" data-tina-field={tinaField(p, "notas")}><RichText content={p.notas} /></section>
        <section className="prints">
          {(p.fotos || []).map((foto: any, i: number) => (
            <Foto key={i} foto={foto} pontos={pontosQueCabem[i]} mostrar={cardTablet === i} onToque={(r) => toque(i, foto, r)} onSolicitar={() => setPedido(foto)} />
          ))}
        </section>
      </main>
      <Rodape />
      <Lightbox zoom={zoom} onClose={() => setZoom(null)} />
      {pedido && <PedidoModal foto={pedido} onClose={() => setPedido(null)} />}
    </>
  );
}
