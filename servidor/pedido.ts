/*
 * Recebe o pedido de impressão enviado pelo formulário dos prints e manda um e-mail
 * para a Carol pelo Resend (https://resend.com).
 *
 * Usa só Request/Response padrão, então roda em Cloudflare Workers, Supabase Edge
 * Functions, Vercel, Netlify ou Deno. A chave do Resend fica nas variáveis do servidor.
 *
 * Variáveis:
 *   RESEND_API_KEY  chave da API do Resend (segredo)
 *   PEDIDO_PARA     e-mail que recebe os pedidos (ex.: carolina.calcavecchia@gmail.com)
 *   PEDIDO_DE       remetente verificado no Resend (ex.: "Site Carol Calcavecchia <pedidos@carolcalcavecchia.com>")
 *   PEDIDO_ORIGENS  (opcional) endereços que podem enviar, separados por vírgula
 *   PEDIDO_TESTE    (opcional) "1" = não envia, só devolve o e-mail montado (para testes)
 */

export type Env = Record<string, string | undefined>;

const SITE = "https://carolcalcavecchia.com";
const ORIGENS_PADRAO = [SITE, "https://www.carolcalcavecchia.com", "http://localhost:3000"];
const TIPOS = ["fotográfica", "fine art"];

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function cors(origem: string | null, env: Env) {
  const permitidas = env.PEDIDO_ORIGENS ? env.PEDIDO_ORIGENS.split(",").map((s) => s.trim()) : ORIGENS_PADRAO;
  const ok = origem && permitidas.includes(origem);
  return {
    "Access-Control-Allow-Origin": ok ? origem! : permitidas[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

const json = (corpo: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...headers, "Content-Type": "application/json" } });

export async function tratarPedido(req: Request, env: Env): Promise<Response> {
  const h = cors(req.headers.get("Origin"), env);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ erro: "Método não permitido." }, 405, h);

  let d: any;
  try { d = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400, h); }

  const nome = texto(d?.nome, 120);
  const email = texto(d?.email, 200);
  const telefone = texto(d?.telefone, 40);
  const tipo = TIPOS.includes(d?.tipo) ? d.tipo : "";
  const moldura = d?.moldura === true;
  const mensagem = texto(d?.mensagem, 2000);
  const foto = {
    id: texto(d?.foto?.id, 60),
    titulo: texto(d?.foto?.titulo, 120),
    tamanho: texto(d?.foto?.tamanho, 40),
    imagem: texto(d?.foto?.imagem, 500),
  };

  if (!nome) return json({ erro: "Preencha o nome." }, 400, h);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ erro: "Confira o e-mail." }, 400, h);
  if (!foto.id) return json({ erro: "Foto não identificada." }, 400, h);

  const imagem = /^https?:\/\//.test(foto.imagem) ? foto.imagem : foto.imagem ? SITE + foto.imagem : "";
  const nomeFoto = `#${foto.id}${foto.titulo ? ` · ${foto.titulo}` : ""}`;
  const linhas: [string, string][] = [
    ["Foto", nomeFoto],
    ["Tamanho", foto.tamanho],
    ["Impressão", tipo],
    ["Moldura", moldura ? "sim" : ""],
    ["Nome", nome],
    ["E-mail", email],
    ["Telefone", telefone],
  ].filter(([, v]) => v) as [string, string][];

  const assunto = `Pedido de impressão — foto ${nomeFoto}`;
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.5">
      <p style="font-size:18px;margin:0 0 12px"><strong>Novo pedido de impressão</strong></p>
      ${imagem ? `<p><img src="${escapar(imagem)}" alt="" style="max-width:320px;height:auto;display:block"></p>` : ""}
      <table style="border-collapse:collapse">${linhas
        .map(([k, v]) => `<tr><td style="padding:3px 16px 3px 0;color:#666">${k}</td><td style="padding:3px 0">${escapar(v)}</td></tr>`)
        .join("")}</table>
      ${mensagem ? `<p style="margin-top:16px;white-space:pre-line">${escapar(mensagem)}</p>` : ""}
      <p style="margin-top:20px;color:#666;font-size:13px">Para responder, é só responder a este e-mail.</p>
    </div>`;
  const textoSimples = [
    "Novo pedido de impressão", "",
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    ...(mensagem ? ["", mensagem] : []),
    ...(imagem ? ["", imagem] : []),
  ].join("\n");

  const email_ = {
    from: env.PEDIDO_DE || "Site Carol Calcavecchia <onboarding@resend.dev>",
    to: [env.PEDIDO_PARA || ""],
    reply_to: email,
    subject: assunto,
    html,
    text: textoSimples,
  };

  if (env.PEDIDO_TESTE === "1") return json({ ok: true, teste: true, email: email_ }, 200, h);
  if (!env.RESEND_API_KEY || !env.PEDIDO_PARA) return json({ erro: "O envio ainda não está configurado." }, 500, h);

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(email_),
  });
  if (!r.ok) {
    console.error("Resend recusou o envio:", r.status, await r.text().catch(() => ""));
    return json({ erro: "Não foi possível enviar agora." }, 502, h);
  }
  return json({ ok: true }, 200, h);
}
