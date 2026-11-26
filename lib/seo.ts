/*
 * Título, descrição e endereço oficial (canônico) de cada página, para o Google e para a
 * prévia ao compartilhar o link. A Carol pode trocar título e descrição de cada página no
 * painel (grupo "Google e compartilhamento"); vazio, vale o texto automático daqui.
 */
export const SITE = "https://carolcalcavecchia.com";
export const NOME = "Carol Calcavecchia";
export const NOME_COMPLETO = "Carolina Calcavecchia";
const OG = { url: "/og.jpg", width: 1200, height: 630, alt: `${NOME} — fotógrafa e filmmaker` };

type Seo = { titulo?: string | null; descricao?: string | null } | null | undefined;

/** Texto corrido de um rich-text do Tina (árvore de nós) ou de um markdown, sem formatação. */
export function textoPuro(conteudo?: any): string {
  if (conteudo && typeof conteudo === "object") {
    const juntar = (n: any): string =>
      typeof n?.text === "string" ? n.text : (n?.children || []).map(juntar).join(n?.type === "root" ? " " : "");
    return juntar(conteudo).replace(/\s+/g, " ").trim();
  }
  return String(conteudo || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")           // imagens
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")        // links → só o texto
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`#>~]+/g, "")
    .replace(/\\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Corta num limite de caracteres sem quebrar palavra (o Google mostra ~155). */
export function resumo(texto: string, max = 155) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return corte.slice(0, corte.lastIndexOf(" ")).replace(/[,;:.\s—-]+$/, "") + "…";
}

/**
 * Metadados completos de uma página. `titulo` sem o nome do site (é acrescentado aqui,
 * exceto na capa, que usa o título inteiro). `caminho` como no site: "/", "/sobre"…
 */
export function metadados({ titulo, descricao, caminho, seo, capa }: {
  titulo: string; descricao: string; caminho: string; seo?: Seo; capa?: boolean;
}) {
  const t = seo?.titulo?.trim() || titulo;
  const tituloFinal = capa ? t : `${t} — ${NOME}`;
  const d = resumo(textoPuro(seo?.descricao) || descricao, 160);
  return {
    title: { absolute: tituloFinal },
    description: d,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website", locale: "pt_BR", siteName: NOME, url: caminho,
      title: tituloFinal, description: d, images: [OG],
    },
    twitter: { card: "summary_large_image", title: tituloFinal, description: d, images: [OG.url] },
  };
}

/** Dados estruturados (schema.org): quem é a Carol, para o Google ligar o site a ela. */
export function pessoa(sobre: { email?: string | null; instagram?: string | null; retrato?: string | null }) {
  return {
    "@type": "Person",
    "@id": `${SITE}/#carol`,
    name: NOME_COMPLETO,
    alternateName: NOME,
    jobTitle: ["Fotógrafa", "Filmmaker"],
    url: `${SITE}/`,
    ...(sobre.retrato ? { image: SITE + sobre.retrato } : {}),
    ...(sobre.email ? { email: `mailto:${sobre.email}` } : {}),
    ...(sobre.instagram ? { sameAs: [sobre.instagram] } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Rio de Janeiro", addressRegion: "RJ", addressCountry: "BR" },
    knowsAbout: ["Fotografia", "Filmmaking", "Fotografia de moda", "Fotografia still", "Retratos", "Impressão fine art"],
  };
}

/** Tag <script type="application/ld+json"> com os dados estruturados. */
export function jsonLd(dados: object) {
  return { __html: JSON.stringify({ "@context": "https://schema.org", ...dados }).replace(/</g, "\\u003c") };
}
