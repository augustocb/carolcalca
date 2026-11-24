"use client";
import { useTina, tinaField } from "tinacms/dist/react";
import { asset } from "@/lib/site";

export default function HomeView(props: { data: any; query: string; variables: any }) {
  const { data } = useTina(props);
  const home = data.home;
  return (
    <div className="home" style={{ ["--capa" as any]: `url("${asset(home.capa)}")` }} data-tina-field={tinaField(home, "capa")}>
      <h1 className="logo">Carol<b>Calcavecchia</b></h1>
      <p className="tagline" data-tina-field={tinaField(home, "tagline")}>{home.tagline}</p>
      <nav>
        <ul className="menu">
          <li><a href="portfolio">portfolio</a></li>
          <li><a href="prints">prints</a></li>
          <li><a href="sobre">sobre</a></li>
        </ul>
      </nav>
    </div>
  );
}
