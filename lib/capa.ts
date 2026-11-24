import gerada from "./capa-gerada.json";
import { asset } from "./site";

/*
 * Versões leves da capa geradas por tools/capa.mjs (preto e branco, 800/1200/1600 px, e uma prévia
 * desfocada). Só valem se forem da mesma foto escolhida no Tina; se a Carol acabou de trocar a capa
 * no painel (e ainda não houve nova publicação), usa a foto original.
 */
type Gerada = { fonte: string | null; versoes?: { src: string; largura: number }[]; previa?: string };
const g = gerada as Gerada;

export type Capa = { src: string; srcSet?: string; previa?: string };

export function capaDoSite(capa: string): Capa {
  // no site publicado, o Tina entrega a foto pela URL do CDN dele (…/__file/hero.webp);
  // compara pelo caminho dentro de images/ (ex.: "/hero.webp")
  const relativo = g.fonte?.replace(/^\/images/, "");
  const mesma = !!relativo && (capa === g.fonte || capa.endsWith(relativo));
  if (!mesma || !g.versoes?.length) return { src: asset(capa) };
  const maior = g.versoes[g.versoes.length - 1];
  const media = g.versoes.find((v) => v.largura >= 1200) || maior;
  return {
    src: asset(media.src),
    srcSet: g.versoes.map((v) => `${asset(v.src)} ${v.largura}w`).join(", "),
    previa: g.previa,
  };
}
