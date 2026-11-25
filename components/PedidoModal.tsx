"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { versoesDaFoto } from "@/lib/fotos";

/*
 * Formulário de pedido de impressão de um print.
 * Envia para a função do servidor (NEXT_PUBLIC_PEDIDO_URL), que manda o e-mail pelo Resend.
 * A chave do Resend fica só no servidor; esta página nunca a vê.
 */

/** Identificação da foto: o nome do arquivo sem extensão (ex.: "/images/prints/12.webp" → "12"). */
export const idDaFoto = (imagem = "") => imagem.split("/").pop()?.replace(/\.[^.]+$/, "") || "";

const MENSAGEM = "Olá! Gostaria de fazer o pedido de impressão desta foto.";
const ENDPOINT = process.env.NEXT_PUBLIC_PEDIDO_URL || "";

type Estado = "editando" | "enviando" | "enviado" | "erro";

export default function PedidoModal({ foto, onClose }: { foto: any; onClose: () => void }) {
  const [estado, setEstado] = useState<Estado>("editando");
  const [erro, setErro] = useState("");
  const primeiro = useRef<HTMLInputElement>(null);
  const id = idDaFoto(foto.imagem);
  const temTipo = foto.tipo !== "fineart";                        // fotográfica ou fine art
  const temMoldura = typeof foto.moldura === "number" && foto.moldura > 0;

  // foco no primeiro campo (só com mouse: no celular e no tablet o teclado abriria sozinho),
  // Esc fecha, e a página de trás não rola
  useEffect(() => {
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) primeiro.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    const html = document.documentElement, antes = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); html.style.overflow = antes; };
  }, [onClose]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando"); setErro("");
    try {
      if (!ENDPOINT) throw new Error("O envio ainda não está configurado.");
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foto: { id, titulo: foto.titulo || "", tamanho: foto.tamanho || "", imagem: foto.imagem || "" },
          nome: f.get("nome"),
          email: f.get("email"),
          telefone: f.get("telefone"),
          tipo: temTipo ? f.get("tipo") : "fine art",
          moldura: temMoldura ? f.get("moldura") === "sim" : false,
          mensagem: f.get("mensagem"),
          // campo-isca: vai junto e o servidor descarta o pedido se vier preenchido
          verificacao: f.get("hp_x7_verificacao") || "",
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.erro || "Não foi possível enviar agora.");
      setEstado("enviado");
    } catch (err: any) {
      setErro(err?.message || "Não foi possível enviar agora.");
      setEstado("erro");
    }
  }

  return (
    <div className="pedido" role="dialog" aria-modal="true" aria-labelledby="pedido-titulo" onClick={onClose}>
      <div className="pedido-caixa" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pedido-fechar" aria-label="fechar" onClick={onClose}>×</button>

        <div className="pedido-foto">
          <img src={versoesDaFoto(foto.imagem).pequena} alt="" />
          <div>
            <h2 id="pedido-titulo">Solicitar impressão</h2>
            <p className="pedido-id">foto #{id}{foto.titulo ? ` · ${foto.titulo}` : ""}</p>
            {foto.tamanho && <p className="pedido-tamanho">tamanho {foto.tamanho}</p>}
          </div>
        </div>

        {estado === "enviado" ? (
          <p className="pedido-ok" role="status">Sua solicitação foi enviada com sucesso. Em breve entrarei em contato!</p>
        ) : (
          <form onSubmit={enviar}>
            <label>Nome<input ref={primeiro} name="nome" required autoComplete="name" /></label>
            <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
            <label>Telefone<input name="telefone" type="tel" autoComplete="tel" /></label>

            {temTipo && (
              <fieldset>
                <legend>Tipo de impressão</legend>
                <label className="pedido-opcao"><input type="radio" name="tipo" value="fotográfica" defaultChecked /> fotográfica</label>
                <label className="pedido-opcao"><input type="radio" name="tipo" value="fine art" /> fine art</label>
              </fieldset>
            )}
            {temMoldura && (
              <label className="pedido-opcao"><input type="checkbox" name="moldura" value="sim" /> com moldura (+ R$ {foto.moldura})</label>
            )}

            <label>Mensagem<textarea name="mensagem" rows={3} defaultValue={MENSAGEM} /></label>

            {/* campo-isca contra robôs: escondido de pessoas, mas robôs costumam preencher.
                O nome não pode lembrar nada que o preenchimento automático do navegador conheça
                (antes era "empresa", e o Chrome preenchia com a empresa salva, descartando pedidos reais). */}
            <input className="pedido-isca" name="hp_x7_verificacao" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {estado === "erro" && (
              <p className="pedido-erro" role="alert">
                {erro} Tente de novo ou escreva para <a href="sobre">o contato</a>.
              </p>
            )}
            <button type="submit" className="pedido-enviar" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : "Enviar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
