# Carol Calcavecchia — site

Site em **Next.js** (gerado como site estático) com o **TinaCMS** para editar o conteúdo
clicando na própria página. Branch de teste: `tina-cms`.

## Como rodar e editar

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Painel de edição: http://localhost:3000/admin/index.html — clique em “Enter Edit Mode”,
  escolha a página e clique em qualquer parte com contorno tracejado para editar.
  Em modo local, salvar grava direto nos arquivos de `content/`.

Para gerar o site estático em `out/`:

```bash
npm run build
```

> Se o build reclamar de dados antigos, apague a pasta `.next` e rode de novo.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Conteúdo editável (textos, preços, fotos de cada página) | `content/` (JSON) |
| O que aparece no painel e como | `tina/config.ts` |
| Páginas | `app/` (capa, `prints`, `sobre`, `portfolio`, `[area]` = `portfolio-*`) |
| Componentes (cards, galerias, menu lateral…) | `components/` |
| Visual e animações | `public/css/style.css`, `public/js/topbar.js`, `public/js/transicao.js` |
| Fotos | `public/images/` (fotos enviadas pelo painel vão para cá) |

- Os textos com formatação (bio, descrições) ficam em Markdown dentro dos JSON.
- O preço da moldura é um campo próprio e aparece no card como acréscimo (+ R$).
- Cada arquivo em `content/portfolio/` vira uma página (`filmes` → `portfolio`, os demais → `portfolio-<nome>`);
  o campo `ordem` define a posição no menu lateral.
- Os links internos não têm `.html` (ex.: `prints`); o GitHub Pages abre `prints.html` sozinho.

## Publicar

Ainda não configurado para esta branch. Para a Carol editar pela internet, o painel precisa
do **Tina Cloud** (gratuito até 2 usuários): criar a conta, conectar o repositório e definir
`NEXT_PUBLIC_TINA_CLIENT_ID` e `TINA_TOKEN`. O site continua estático; no GitHub Pages ele é
gerado com `NEXT_PUBLIC_BASE_PATH=/carolcalca` (por estar em `augustocb.github.io/carolcalca`).
