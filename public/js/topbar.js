/*
 * Topbar das páginas internas.
 * - No começo, ela rola junto com a página, sendo empurrada para cima até sumir.
 * - Quando já saiu da tela, volta como barra fixa e compacta (logo à esquerda,
 *   menu centralizado), descendo do topo; logo e itens chegam em cascata.
 * - Ao voltar para o topo, a barra compacta sobe e sai, e a topbar original
 *   reaparece naturalmente com a rolagem.
 * - No celular, a barra (logo + hambúrguer) fica sempre fixa no topo, sem troca nem
 *   animação; o menu abre em tela cheia.
 */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  const parts = [header.querySelector('.logo'), ...header.querySelectorAll('.menu li')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  const SPRING = 'linear(0, .034, .118, .231, .356, .482, .6, .706, .796, .87, .928, .973, 1.004, 1.026, 1.038, 1.045, 1.046, 1.044, 1.04, 1.035, 1.029, 1.023, 1.018, 1.013, 1.009, 1.006, 1.003, 1.001, 1, .999, .998, .998, 1)';
  const EASE = CSS.supports('animation-timing-function', SPRING) ? SPRING : 'cubic-bezier(.22, 1, .36, 1)';
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
    running.push(header.animate(
      [{ transform: 'translateY(-100%)' }, { transform: 'none' }],
      { duration: 700, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    ));
    parts.forEach((p, i) => running.push(p.animate(
      [{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 1000 + i * 80, delay: 120 + i * 60, easing: EASE, fill: 'backwards' }
    )));
  }

  function hide(animate) {           // barra compacta sobe e sai
    compact = false;
    if (!animate || reduce.matches || mobile.matches) { stop(); header.classList.remove('compact'); return; }
    stop();
    const a = header.animate(
      [{ transform: 'none' }, { transform: 'translateY(-100%)' }],
      { duration: 280, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' }
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
