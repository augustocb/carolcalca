/*
 * Gera as versões leves das fotos da capa, antes de cada build.
 *
 * Lê as fotos escolhidas no Tina (content/home/home.json → "capa" e "outrasCapas",
 * arquivos em public/) e cria em public/images/capa/:
 *   <nome>-800.webp, -1200.webp, -1600.webp (e 2400 se a foto for grande);
 *   a foto principal em preto e branco, as outras com as cores originais
 * e em lib/capa-gerada.json o caminho de cada uma; a primeira ganha também uma prévia
 * minúscula desfocada (base64), mostrada enquanto a foto carrega.
 *
 * Uso: node tools/capa.mjs   (os scripts dev, build e build:cloud já rodam isto antes)
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const home = JSON.parse(readFileSync("content/home/home.json", "utf8"));
const fontes = [home.capa, ...(home.outrasCapas || [])].filter(Boolean);

mkdirSync("public/images/capa", { recursive: true });
const capas = [];
for (const [i, fonte] of fontes.entries()) {
  const arquivo = "public" + fonte;
  if (!existsSync(arquivo)) { console.warn(`capa: arquivo não encontrado (${arquivo}); usa a foto original`); continue; }
  const nome = fonte.replace(/^\/images\//, "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
  const original = sharp(arquivo).rotate();
  const { width: larguraOriginal } = await original.metadata();
  const larguras = [800, 1200, 1600, 2400].filter((l, j) => j === 0 || l <= larguraOriginal);
  const versoes = [];
  for (const l of larguras) {
    const caminho = `/images/capa/${nome}-${l}.webp`;
    let img = original.clone().resize({ width: l, withoutEnlargement: true });
    if (i === 0) img = img.grayscale();               // só a foto principal fica em preto e branco
    const info = await img.webp({ quality: i === 0 ? 50 : 72, effort: 6 })   // na principal, a granulação esconde a compressão
      .toFile("public" + caminho);
    versoes.push({ src: caminho, largura: info.width });
    console.log(`capa: ${caminho} (${info.width}px, ${Math.round(info.size / 1024)} KB)`);
  }
  const capa = { fonte, versoes };
  if (i === 0) {
    const previa = await original.clone().resize({ width: 32 }).grayscale().blur(1.2).webp({ quality: 40 }).toBuffer();
    capa.previa = `data:image/webp;base64,${previa.toString("base64")}`;
  }
  capas.push(capa);
}

writeFileSync("lib/capa-gerada.json", JSON.stringify({ capas }, null, 2) + "\n");
console.log(`capa: ${capas.length} foto(s)`);
