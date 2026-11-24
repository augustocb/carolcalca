import { defineConfig, type Template } from "tinacms";

/*
 * O que a Carol consegue editar pelo painel do Tina (/admin).
 * Os dados ficam em content/*.json; as fotos enviadas pelo painel vão para public/images.
 */

const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "tina-cms";

const portfolioPath = (filename: string) =>
  filename === "filmes" ? "/portfolio" : `/portfolio-${filename}`;

// ---------- blocos das páginas do portfolio ----------

const texto: Template = {
  name: "texto",
  label: "Texto",
  fields: [{ type: "rich-text", name: "corpo", label: "Texto" }],
};

const filmes: Template = {
  name: "filmes",
  label: "Lista de filmes",
  fields: [
    {
      type: "object",
      name: "itens",
      label: "Filmes",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.titulo || "Filme" }) },
      fields: [
        { type: "string", name: "titulo", label: "Título" },
        { type: "string", name: "ano", label: "Ano" },
        { type: "rich-text", name: "descricao", label: "Descrição" },
        {
          type: "string",
          name: "video",
          label: "Link do vídeo",
          description: "Endereço do vídeo no YouTube ou no Vimeo (ex.: https://vimeo.com/126454991)",
        },
      ],
    },
  ],
};

const livros: Template = {
  name: "livros",
  label: "Lista de livros",
  fields: [
    {
      type: "object",
      name: "itens",
      label: "Livros",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.titulo || "Livro" }) },
      fields: [
        { type: "string", name: "titulo", label: "Título" },
        { type: "image", name: "capa", label: "Capa" },
        { type: "string", name: "capaAlt", label: "Descrição da capa (para leitores de tela)" },
        { type: "rich-text", name: "descricao", label: "Descrição" },
        { type: "string", name: "link", label: "Link" },
        { type: "string", name: "linkTexto", label: "Texto do link", description: "ex.: conheça o livro" },
      ],
    },
  ],
};

const galeria: Template = {
  name: "galeria",
  label: "Galeria de fotos",
  ui: { itemProps: (item) => ({ label: item?.titulo ? `Galeria: ${item.titulo}` : "Galeria" }) },
  fields: [
    { type: "string", name: "titulo", label: "Título (opcional)" },
    {
      type: "string",
      name: "ancora",
      label: "Âncora no menu lateral (opcional)",
      description: "Um nome curto, sem espaços (ex.: moda). Faz a galeria aparecer como subitem no menu lateral.",
    },
    {
      type: "string",
      name: "arranjo",
      label: "Arranjo das fotos",
      options: [
        { value: "colunas", label: "Duas colunas" },
        { value: "retratos", label: "Uma vertical grande + três horizontais" },
        { value: "familia", label: "Uma vertical grande + duas verticais" },
        { value: "jornadas", label: "Uma horizontal grande + duas horizontais" },
        { value: "feiras", label: "Horizontal + vertical lado a lado" },
        { value: "destaque", label: "Uma foto em destaque, na largura toda" },
      ],
    },
    {
      type: "object",
      name: "fotos",
      label: "Fotos",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.alt || "Foto" }) },
      fields: [
        { type: "image", name: "imagem", label: "Foto" },
        { type: "string", name: "alt", label: "Descrição (para leitores de tela)" },
        { type: "string", name: "legenda", label: "Legenda (opcional)" },
      ],
    },
    { type: "string", name: "legenda", label: "Legenda da galeria (opcional)" },
  ],
};

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    // site servido num subcaminho (augustocb.github.io/carolcalca)
    basePath: (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/^\//, "") || undefined,
  },
  media: { tina: { mediaRoot: "images", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "home",
        label: "Capa",
        path: "content/home",
        format: "json",
        ui: { allowedActions: { create: false, delete: false }, router: () => "/" },
        fields: [
          { type: "string", name: "tagline", label: "Frase abaixo do nome" },
          { type: "image", name: "capa", label: "Foto da capa", description: "Aparece em preto e branco." },
        ],
      },
      {
        name: "sobre",
        label: "Sobre",
        path: "content/sobre",
        format: "json",
        ui: { allowedActions: { create: false, delete: false }, router: () => "/sobre" },
        fields: [
          { type: "rich-text", name: "bio", label: "Bio" },
          { type: "image", name: "retrato", label: "Retrato" },
          { type: "string", name: "retratoAlt", label: "Descrição do retrato (para leitores de tela)" },
          { type: "string", name: "email", label: "E-mail" },
          { type: "string", name: "instagram", label: "Link do Instagram" },
          { type: "string", name: "instagramTexto", label: "Texto do Instagram", description: "ex.: @carolina.calcavecchia" },
        ],
      },
      {
        name: "prints",
        label: "Prints",
        path: "content/prints",
        format: "json",
        ui: { allowedActions: { create: false, delete: false }, router: () => "/prints" },
        fields: [
          { type: "rich-text", name: "notas", label: "Texto do começo da página" },
          {
            type: "object",
            name: "fotos",
            label: "Fotos",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.titulo || item?.alt || "Foto" }) },
            fields: [
              { type: "image", name: "imagem", label: "Foto" },
              { type: "string", name: "alt", label: "Descrição (para leitores de tela)" },
              {
                type: "string",
                name: "coluna",
                label: "Largura na grade",
                description: "A grade tem 8 colunas; cada linha deve somar 8 (contando o ponto).",
                options: [
                  { value: "w8", label: "8 — largura toda" },
                  { value: "w6", label: "6" },
                  { value: "w5", label: "5" },
                  { value: "w4", label: "4 — metade" },
                  { value: "w3", label: "3" },
                ],
              },
              {
                type: "string",
                name: "ponto",
                label: "Ponto decorativo",
                options: [
                  { value: "nenhum", label: "Nenhum" },
                  { value: "antes-2", label: "Antes da foto (2 colunas)" },
                  { value: "depois-2", label: "Depois da foto (2 colunas)" },
                  { value: "antes-3", label: "Antes da foto (3 colunas)" },
                  { value: "depois-3", label: "Depois da foto (3 colunas)" },
                ],
              },
              {
                type: "string",
                name: "tipo",
                label: "Venda",
                options: [
                  { value: "padrao", label: "Fotográfica e fine art" },
                  { value: "fineart", label: "Só fine art" },
                  { value: "nenhum", label: "Não está à venda (sem card)" },
                ],
              },
              { type: "string", name: "titulo", label: "Título (opcional)" },
              { type: "string", name: "tamanho", label: "Tamanho", description: "ex.: a4, a3, 38 × 13 cm" },
              { type: "number", name: "fineArt", label: "Preço do fine art (R$)" },
              {
                type: "number",
                name: "moldura",
                label: "Preço da moldura (R$)",
                description: "Aparece no card como acréscimo (+ R$), valendo para qualquer impressão.",
              },
              { type: "string", name: "nota", label: "Observação (opcional)" },
            ],
          },
        ],
      },
      {
        name: "portfolio",
        label: "Portfolio",
        path: "content/portfolio",
        format: "json",
        ui: { router: ({ document }) => portfolioPath(document._sys.filename) },
        fields: [
          { type: "string", name: "titulo", label: "Título da página", isTitle: true, required: true },
          { type: "string", name: "menu", label: "Nome no menu lateral" },
          { type: "number", name: "ordem", label: "Ordem no menu" },
          { type: "object", name: "blocos", label: "Conteúdo", list: true, templates: [texto, filmes, livros, galeria] },
        ],
      },
    ],
  },
});
