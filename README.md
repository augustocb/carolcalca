# Carol Calcavecchia — site

Site em **Next.js** (gerado como site estático) com o **TinaCMS** para editar o conteúdo
clicando na própria página. A branch do site é a `tina-cms`.

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

É automático. A cada push na branch `tina-cms`, inclusive quando a Carol salva algo no
painel online, o GitHub Actions (`.github/workflows/publicar-site.yml`) gera o site com o
conteúdo do Tina Cloud e publica na branch `gh-pages`, que o GitHub Pages serve em
https://augustocb.github.io/carolcalca. Leva cerca de 2 minutos.

- Painel online: https://augustocb.github.io/carolcalca/admin/index.html (login do Tina Cloud;
  quem edita precisa ser convidado no projeto, até 2 pessoas no plano grátis).
- Chaves usadas na publicação, em Settings → Secrets and variables → Actions:
  a variável `TINA_CLIENT_ID` e o segredo `TINA_TOKEN`.
- Não envie nada à mão para a `gh-pages`: ela é substituída inteira a cada publicação.
- Para publicar sem mudar nada (ex.: depois de trocar as chaves), rode o workflow
  “Publicar site” manualmente na aba Actions.
