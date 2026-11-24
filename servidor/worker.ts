/* Entrada do Cloudflare Worker que recebe os pedidos de impressão (ver servidor/pedido.ts). */
import { tratarPedido, type Env } from "./pedido";

export default {
  fetch: (req: Request, env: Env) => tratarPedido(req, env),
};
