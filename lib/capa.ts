import gerada from "./capa-gerada.json";
import { asset } from "./site";

/*
 * Versões leves das fotos da capa geradas por tools/capa.mjs (preto e branco, 800/1200/1600 px,
 * e uma prévia desfocada da primeira). Se a Carol acabou de trocar uma foto no painel (e ainda
 * não houve nova publicação), usa a foto original.
 */
type Versao = { src: string; largura: number };
type Gerada = { capas?: { fonte: string; versoes: Versao[]; previa?: string }[] };
const g = gerada as Gerada;

export type Capa = { src: string; srcSet?: string; previa?: string };

export function capaDoSite(capa: string): Capa {
  // no site publicado, o Tina entrega a foto pela URL do CDN dele (…/hero.webp);
  // compara pelo caminho dentro de images/ (ex.: "/hero.webp")
  const achada = (g.capas || []).find((c) => capa === c.fonte || capa.endsWith(c.fonte.replace(/^\/images/, "")));
  if (!achada?.versoes.length) return { src: asset(capa) };
  const maior = achada.versoes[achada.versoes.length - 1];
  const media = achada.versoes.find((v) => v.largura >= 1200) || maior;
  return {
    src: asset(media.src),
    srcSet: achada.versoes.map((v) => `${asset(v.src)} ${v.largura}w`).join(", "),
    previa: achada.previa,
  };
}
