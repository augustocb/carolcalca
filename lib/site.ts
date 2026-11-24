/** Prefixo do site quando publicado num subcaminho (GitHub Pages: /carolcalca). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Caminho de um arquivo de public/ (ex.: "/images/x.jpg") com o prefixo do site. */
export const asset = (src?: string | null) =>
  !src ? "" : src.startsWith("/") ? basePath + src : src;

/** Endereço de cada página do portfolio a partir do nome do arquivo de conteúdo. */
export const portfolioHref = (filename: string) =>
  filename === "filmes" ? "portfolio" : `portfolio-${filename}`;

/** Link de vídeo do YouTube ou do Vimeo -> endereço do player para embed. */
export function videoEmbed(url = "") {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?dnt=1`;
  return url;
}
