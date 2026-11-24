/* Topbar das páginas internas (o comportamento fica em public/js/topbar.js). */
const itens = [
  { href: "portfolio", label: "portfolio" },
  { href: "prints", label: "prints" },
  { href: "sobre", label: "sobre" },
];

export default function SiteHeader({ atual }: { atual: "portfolio" | "prints" | "sobre" }) {
  return (
    <header className="site-header" suppressHydrationWarning>
      <a href="./" className="logo">Carol<b>Calcavecchia</b></a>
      <nav id="site-nav">
        <ul className="menu">
          {itens.map((i) => (
            <li key={i.href}>
              <a href={i.href} data-label={i.label} aria-current={i.href === atual ? "page" : undefined}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button className="nav-toggle" type="button" suppressHydrationWarning aria-expanded="false" aria-controls="site-nav" aria-label="abrir menu">
        <span></span><span></span>
      </button>
    </header>
  );
}
