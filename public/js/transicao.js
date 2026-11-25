/*
 * Marca a transição da capa para uma página interna ("to-inner"),
 * para o CSS segurar o conteúdo e o sublinhado até o título e o menu chegarem.
 * Precisa ser carregado no <head>, antes da página aparecer.
 */
window.addEventListener('pagereveal', e => {
  if (!e.viewTransition) return;
  const from = (window.navigation && navigation.activation && navigation.activation.from &&
                navigation.activation.from.url) || document.referrer;
  if (!from) return;
  const isHome = url => /\/(index\.html)?$/.test(new URL(url, location.href).pathname);
  if (isHome(from) && !isHome(location.href) && e.viewTransition.types) e.viewTransition.types.add('to-inner');
});

// a rolagem suave (scroll-behavior: smooth) fica só para os cliques dentro da página:
// ao abrir uma página já numa subseção, o navegador vai direto até ela
if (location.hash) {
  document.documentElement.style.scrollBehavior = 'auto';
  addEventListener('load', () => setTimeout(() => document.documentElement.style.scrollBehavior = '', 300));
}

/*
 * Entre páginas internas, quando a topbar muda de forma (uma página está com a barra
 * compacta e a outra com a topbar aberta, como ao clicar numa subseção do portfolio,
 * que abre a página já rolada), o logo e o menu não viajam de um lugar para o outro:
 * a topbar some e aparece junto com a página, num fade suave.
 */
const SEM_TOPBAR = 'vt-sem-topbar';
const ehInterna = url => !/\/(index\.html)?$/.test(new URL(url, location.href).pathname);

window.addEventListener('pageswap', e => {
  if (!e.viewTransition || !e.activation || !e.activation.entry) return;
  const destino = new URL(e.activation.entry.url);
  const barra = document.querySelector('.site-header');
  const compacta = barra && barra.classList.contains('compact');
  if (barra && ehInterna(destino.href) && (compacta || destino.hash)) {
    document.documentElement.classList.add(SEM_TOPBAR);
    try { sessionStorage.setItem(SEM_TOPBAR, '1'); } catch (_) {}
  }
});

window.addEventListener('pagereveal', e => {
  let veioCompacta = false;
  try { veioCompacta = sessionStorage.getItem(SEM_TOPBAR) === '1'; sessionStorage.removeItem(SEM_TOPBAR); } catch (_) {}
  // link para uma subseção (ex.: portfolio-fotografia#moda): a página já abre nela, sem a
  // rolagem suave do topo até lá (que fazia a topbar sumir e a barra compacta descer)
  let alvo = null;
  try { alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) {}
  if (alvo) alvo.scrollIntoView({ behavior: 'instant', block: 'start' });
  if (!e.viewTransition) return;
  const barra = document.querySelector('.site-header');
  if (!barra || !(veioCompacta || location.hash)) return;
  document.documentElement.classList.add(SEM_TOPBAR);
  // se a página já abre rolada, a barra compacta já entra na foto da transição (sem descer depois)
  if (!matchMedia('(max-width: 700px)').matches && scrollY >= barra.offsetHeight) barra.classList.add('compact');
  e.viewTransition.finished.finally(() => document.documentElement.classList.remove(SEM_TOPBAR));
});

// ao voltar para a página pelo botão "voltar", ela não fica presa sem as transições
window.addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove(SEM_TOPBAR); });
