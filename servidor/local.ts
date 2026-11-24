/*
 * Roda a função de pedido no seu Mac, para testar o formulário.
 *   node servidor/local.ts            (lê RESEND_API_KEY, PEDIDO_PARA e PEDIDO_DE do .env)
 *   PEDIDO_TESTE=1 node servidor/local.ts   (não envia: só mostra o e-mail montado)
 * E rode o site com NEXT_PUBLIC_PEDIDO_URL=http://localhost:8787 npm run dev
 */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { tratarPedido } from "./pedido.ts";

if (existsSync(".env")) {
  for (const linha of readFileSync(".env", "utf8").split("\n")) {
    const m = linha.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

createServer(async (req, res) => {
  const partes: Buffer[] = [];
  for await (const p of req) partes.push(p as Buffer);
  const corpo = partes.length ? Buffer.concat(partes) : undefined;
  const request = new Request(`http://localhost:8787${req.url}`, {
    method: req.method, headers: req.headers as Record<string, string>,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : corpo,
  });
  const r = await tratarPedido(request, process.env);
  res.writeHead(r.status, Object.fromEntries(r.headers));
  const texto = await r.text();
  if (process.env.PEDIDO_TESTE === "1" && req.method === "POST") console.log("pedido recebido:", texto);
  res.end(texto);
}).listen(8787, () => console.log("função de pedido em http://localhost:8787"));
