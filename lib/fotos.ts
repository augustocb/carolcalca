import geradas from "./fotos-geradas.json";
import { asset } from "./site";

/*
 * Versões leves das fotos dos prints, geradas por tools/fotos.mjs (WebP de 800/1200/1800 px).
 * Se a foto ainda não tem versões (enviada pelo painel depois da última publicação), usa a original.
 */
type Versoes = { versoes: { src: string; largura: number }[] };
const mapa = geradas as Record<string, Versoes>;
const porCaminho: Record<string, Versoes> = Object.fromEntries(
  Object.entries(mapa).map(([fonte, v]) => [fonte.replace(/^\/images/, ""), v]),
);

export type Foto = { src: string; srcSet?: string; grande: string; pequena: string };

export function versoesDaFoto(imagem: string): Foto {
  // no site publicado, o Tina entrega a foto pela URL do CDN dele (…/__file/prints/05.webp)
  const m = imagem?.match(/__file(\/.+)$/);
  const relativo = m ? m[1] : imagem?.replace(/^\/images/, "");
  const v = (relativo && porCaminho[relativo]) || undefined;
  if (!v?.versoes?.length) return { src: asset(imagem), grande: asset(imagem), pequena: asset(imagem) };
  const ordenadas = [...v.versoes].sort((a, b) => a.largura - b.largura);
  const media = ordenadas.find((x) => x.largura >= 1200) || ordenadas[ordenadas.length - 1];
  return {
    src: asset(media.src),
    srcSet: ordenadas.map((x) => `${asset(x.src)} ${x.largura}w`).join(", "),
    grande: asset(ordenadas[ordenadas.length - 1].src),   // para a foto ampliada
    pequena: asset(ordenadas[0].src),                      // miniaturas (ex.: formulário de pedido)
  };
}

/** Largura que cada coluna da grade ocupa na tela (a grade tem no máximo 1500 px). */
export const tamanhoNaGrade: Record<string, string> = {
  w8: "(max-width: 700px) 100vw, min(100vw, 1500px)",
  w6: "(max-width: 700px) 100vw, min(75vw, 1125px)",
  w5: "(max-width: 700px) 100vw, min(63vw, 940px)",
  w4: "(max-width: 700px) 100vw, min(50vw, 750px)",
  w3: "(max-width: 700px) 100vw, min(38vw, 565px)",
};
