# Carol Calcavecchia — site

Site estático (HTML + CSS + JS puro, sem build). Abra `index.html` no navegador ou publique a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Páginas
- `index.html` — capa com foto em P&B, nome e menu
- `prints.html` — grade de fotos com tabela de preços e lightbox (clique para ampliar, Esc fecha)
- Portfolio, uma página por área, com menu lateral entre elas (fotos em `images/portfolio/`):
  - `portfolio.html` — filmes (é a página que o menu principal abre)
  - `portfolio-fotografia.html` — fotografia, com as 6 galerias
  - `portfolio-filmmaker.html`, `portfolio-logger.html`, `portfolio-exposicoes.html`, `portfolio-publicacoes.html`, `portfolio-feiras.html`
- `sobre.html` — sobre: bio, retrato, e-mail e Instagram

## Como trocar o conteúdo
- **Foto da capa:** substitua `images/hero.webp` (ela é convertida para P&B automaticamente).
- **Prints:** substitua `images/prints/01.webp` … `09.webp` (fotos em .webp, até 1600px no lado maior).
- **Portfolio:** o conteúdo de cada área está direto na sua página. O menu lateral e a navegação anterior/próxima se repetem em todas: ao criar ou renomear uma área, atualize os sete arquivos.
- **Instagram:** troque o link em `sobre.html`.
