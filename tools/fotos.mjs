/*
 * Gera versões leves das fotos dos prints, antes de cada build.
 *
 * A Carol pode enviar pelo painel a foto no tamanho original da câmera (vários MB);
 * o site mostra versões WebP redimensionadas, escolhidas pelo navegador conforme a tela:
 *   public/images/leves/<nome>-800.webp, -1200.webp, -1800.webp (até o tamanho da original)
 * e lib/fotos-geradas.json diz, para cada foto ("/images/…"), quais versões existem.
 *
 * Fotos já geradas e mais novas que a original são puladas (rodar de novo é rápido).
 * Uso: node tools/fotos.mjs   (os scripts dev, build e build:cloud já rodam isto antes)
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";

const LARGURAS = [800, 1200, 1800];
const PASTA = "/images/leves";

const prints = JSON.parse(readFileSync("content/prints/prints.json", "utf8"));
const fotos = [...new Set((prints.fotos || []).map((f) => f.imagem).filter(Boolean))];

mkdirSync("public" + PASTA, { recursive: true });
const mapa = {};
let geradas = 0, puladas = 0, antes = 0, depois = 0;

for (const fonte of fotos) {
  const arquivo = "public" + fonte;
  if (!existsSync(arquivo)) { console.warn(`fotos: não encontrada ${arquivo} (fica a original)`); continue; }
  // nome único a partir do caminho: /images/prints/05.webp → prints-05
  const nome = fonte.replace(/^\/images\//, "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
  const img = sharp(arquivo).rotate();                 // respeita a orientação gravada pela câmera
  const { width: larguraOriginal } = await img.metadata();
  const larguras = LARGURAS.filter((l, i) => i === 0 || l <= larguraOriginal);
  // original entre dois tamanhos (ex.: 1600 px): inclui uma versão no tamanho dela, para não perder nitidez
  if (larguraOriginal > larguras[larguras.length - 1] && larguraOriginal < LARGURAS[LARGURAS.length - 1]) larguras.push(larguraOriginal);
  const versoes = [];
  const tOrig = statSync(arquivo).mtimeMs;
  antes += statSync(arquivo).size;
  for (const l of larguras) {
    const caminho = `${PASTA}/${nome}-${l}.webp`;
    const destino = "public" + caminho;
    if (existsSync(destino) && statSync(destino).mtimeMs > tOrig) {
      puladas++;
    } else {
      await img.clone().resize({ width: l, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(destino);
      geradas++;
    }
    versoes.push({ src: caminho, largura: Math.min(l, larguraOriginal) });
  }
  depois += statSync("public" + versoes[Math.min(1, versoes.length - 1)].src).size;   // a de 1200, a mais usada
  mapa[fonte] = { versoes };
}

writeFileSync("lib/fotos-geradas.json", JSON.stringify(mapa, null, 2) + "\n");
console.log(`fotos: ${Object.keys(mapa).length} fotos, ${geradas} versões geradas, ${puladas} já existiam`);
console.log(`fotos: originais somam ${(antes / 1048576).toFixed(1)} MB; versões de 1200 px somam ${(depois / 1048576).toFixed(1)} MB`);
