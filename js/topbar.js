/*
 * Topbar das páginas internas.
 * - No começo, ela rola junto com a página, sendo empurrada para cima até sumir.
 * - Quando já saiu da tela, volta como barra fixa e compacta (logo à esquerda,
 *   menu à direita), descendo do topo com um leve fade (logo e menu vêm junto).
 * - Ao voltar para o topo, a barra compacta sobe e sai, e a topbar original
 *   reaparece naturalmente com a rolagem.
 * - No celular, a barra (logo + hambúrguer) fica sempre fixa no topo, sem troca nem
 *   animação; o menu abre em tela cheia.
 */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  let openH = 0;          // altura da topbar aberta
  let compact = false;
  let running = [];

  function measure() {
    const was = header.classList.contains('compact');
    header.classList.remove('compact');
    openH = header.offsetHeight;
    root.style.setProperty('--header-h', openH + 'px');
    header.classList.add('compact');
    root.style.setProperty('--bar-h', header.offsetHeight + 'px');
    header.classList.toggle('compact', was);
  }

  const stop = () => { running.forEach(a => a.cancel()); running = []; };

  function show(animate) {           // barra compacta desce do topo
    stop();
    header.classList.add('compact');
    compact = true;
    // no celular a barra é sempre a mesma e fica fixa: nada a animar
    if (!animate || reduce.matches || mobile.matches) return;
    // a barra inteira desce com um leve fade; logo e menu vêm junto, sem animação própria
    running.push(header.animate(
      [{ transform: 'translateY(-100%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 650, easing: 'cubic-bezier(.25, .8, .25, 1)' }
    ));
  }

  function hide(animate) {           // barra compacta sobe e sai
    compact = false;
    if (!animate || reduce.matches || mobile.matches) { stop(); header.classList.remove('compact'); return; }
    stop();
    const a = header.animate(
      [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }],
      { duration: 420, easing: 'cubic-bezier(.45, 0, .55, 1)', fill: 'forwards' }
    );
    running.push(a);
    a.finished.then(() => { if (!compact) { header.classList.remove('compact'); a.cancel(); } }, () => {});
  }

  // compacta no instante em que a topbar original sai inteira da tela (sem intervalo
  // vazio no topo); só abre de novo depois de voltar alguns pixels (evita piscar no limite)
  function onScroll() {
    if (!compact && scrollY >= openH) show(true);
    else if (compact && scrollY < openH - 6) hide(true);
  }

  // ---- menu hambúrguer (celular) ----
  const toggle = header.querySelector('.nav-toggle');
  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';        // trava a rolagem com o menu aberto
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'fechar menu' : 'abrir menu');
  }
  if (toggle) {
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    header.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
    addEventListener('pageshow', () => setMenu(false));  // voltar pelo navegador com o menu aberto
  }

  measure();
  if (scrollY >= openH) show(false);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); });
  document.fonts && document.fonts.ready.then(measure);
})();
