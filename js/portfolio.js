/*
 * Portfolio: menu lateral que marca a seção visível, e zoom das fotos.
 */
(() => {
  // ---- menu lateral: marca o item da seção que está na tela ----
  const links = [...document.querySelectorAll('.pf-nav a')];
  const byId = new Map(links.map(a => [a.hash.slice(1), a]));
  const targets = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  let current = null;

  function mark(id) {
    if (id === current) return;
    current = id;
    links.forEach(a => a.removeAttribute('aria-current'));
    const a = byId.get(id);
    if (!a) return;
    a.setAttribute('aria-current', 'true');
    // subitem ativo também destaca o item pai (fotografia)
    const parent = a.closest('ul ul')?.closest('li')?.querySelector(':scope > a');
    if (parent) parent.setAttribute('aria-current', 'true');
    // no celular o menu rola de lado: traz o item ativo para a vista
    const nav = a.closest('.pf-nav');
    if (nav && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    }
  }

  function update() {
    // a última seção cujo topo já passou do terço de cima da tela
    const line = innerHeight * 0.3;
    let id = targets[0]?.id;
    for (const t of targets) if (t.getBoundingClientRect().top <= line) id = t.id;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) id = targets[targets.length - 1].id;
    mark(id);
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  // ---- zoom das fotos ----
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.pf-gallery img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lb.classList.add('open');
    });
  });
  const close = () => lb.classList.remove('open');
  lb.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
