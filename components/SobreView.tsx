"use client";
import { useTina, tinaField } from "tinacms/dist/react";
import Rodape from "@/components/Rodape";
import SiteHeader from "./SiteHeader";
import RichText from "./RichText";
import { asset } from "@/lib/site";

export default function SobreView(props: { data: any; query: string; variables: any }) {
  const { data } = useTina(props);
  const s = data.sobre;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${s.email}`;
  return (
    <>
      <SiteHeader atual="sobre" />
      <main>
        <h1 className="page-title">sobre</h1>
        <section className="sobre">
          <div className="bio" data-tina-field={tinaField(s, "bio")}><RichText content={s.bio} /></div>
          <img className="retrato" src={asset(s.retrato)} alt={s.retratoAlt || ""} data-tina-field={tinaField(s, "retrato")} />
        </section>
        <section className="contato">
          <a href={gmail} target="_blank" rel="noopener" data-tina-field={tinaField(s, "email")}>{s.email}</a>
          <a href={s.instagram} target="_blank" rel="noopener" data-tina-field={tinaField(s, "instagramTexto")}>{s.instagramTexto}</a>
        </section>
      </main>
      <Rodape />
    </>
  );
}
