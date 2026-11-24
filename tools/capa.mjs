/*
 * Gera as versões leves da foto da capa, antes de cada build.
 *
 * Lê a foto escolhida no Tina (content/home/home.json → "capa", um arquivo em public/)
 * e cria em public/images/capa/:
 *   capa-800.webp, capa-1200.webp, capa-1600.webp (e 2400 se a foto for grande), já em preto e branco
 * e em lib/capa-gerada.json o caminho de cada uma e uma prévia minúscula desfocada (base64),
 * mostrada enquanto a foto carrega.
 *
 * Uso: node tools/capa.mjs   (os scripts build e build:cloud já rodam isto antes)
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const home = JSON.parse(readFileSync("content/home/home.json", "utf8"));
const fonte = home.capa;                                   // ex.: "/images/hero.webp"
const arquivo = "public" + fonte;
if (!fonte || !existsSync(arquivo)) {
  console.warn(`capa: arquivo não encontrado (${arquivo}); a capa usa a foto original`);
  writeFileSync("lib/capa-gerada.json", JSON.stringify({ fonte: null }, null, 2) + "\n");
  process.exit(0);
}

mkdirSync("public/images/capa", { recursive: true });
const original = sharp(arquivo).rotate();
const { width: larguraOriginal } = await original.metadata();
const larguras = [800, 1200, 1600, 2400].filter((l, i) => i === 0 || l <= larguraOriginal);

const versoes = [];
for (const l of larguras) {
  const caminho = `/images/capa/capa-${l}.webp`;
  const info = await original.clone().resize({ width: l, withoutEnlargement: true })
    .grayscale().webp({ quality: 50, effort: 6 })   // a granulação da foto esconde a compressão
    .toFile("public" + caminho);
  versoes.push({ src: caminho, largura: info.width });
  console.log(`capa: ${caminho} (${info.width}px, ${Math.round(info.size / 1024)} KB)`);
}

const previa = await original.clone().resize({ width: 32 }).grayscale().blur(1.2).webp({ quality: 40 }).toBuffer();
writeFileSync("lib/capa-gerada.json", JSON.stringify({
  fonte,
  versoes,
  previa: `data:image/webp;base64,${previa.toString("base64")}`,
}, null, 2) + "\n");
console.log(`capa: prévia de ${previa.length} bytes`);
