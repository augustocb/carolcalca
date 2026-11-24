"use client";
import { useEffect, type ReactNode } from "react";

/* Foto ampliada. Fecha ao clicar ou com Esc. `extra` aparece abaixo da foto (card no celular). */
export type Zoom = { src: string; alt: string; extra?: ReactNode } | null;

export default function Lightbox({ zoom, onClose }: { zoom: Zoom; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className={`lightbox${zoom ? " open" : ""}`} role="dialog" aria-modal="true" onClick={onClose}>
      {zoom && <img src={zoom.src} alt={zoom.alt} />}
      {zoom?.extra}
    </div>
  );
}
