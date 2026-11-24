/*
 * Portfolio: cada área é uma página. O item da página atual vem marcado no HTML
 * (aria-current="page"); na página de fotografia, o menu também marca a subárea
 * visível ao rolar. Inclui o zoom das fotos.
 */
(() => {
  const nav = document.querySelector('.pf-nav');

  // ---- celular: o menu rola de lado; mostra o item ativo ----
  function reveal(a) {
    if (nav && a && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2 });
    }
  }
  reveal(nav && nav.querySelector('a[aria-current="page"]'));

  // ---- subáreas desta página (fotografia): marca a que está na tela ----
  const subLinks = [...document.querySelectorAll('.pf-nav a[href^="#"]')]
    .filter(a => document.getElementById(a.hash.slice(1)));
  if (subLinks.length) {
    const targets = subLinks.map(a => document.getElementById(a.hash.slice(1)));
    let current = null;
    const update = () => {
      const line = innerHeight * 0.3;
      let id = null;
      for (const t of targets) if (t.getBoundingClientRect().top <= line) id = t.id;
      if (id === current) return;
      current = id;
      subLinks.forEach(a => a.toggleAttribute('aria-current', a.hash === '#' + id));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // ---- zoom das fotos ----
  const lb = document.getElementById('lightbox');
  if (!lb) return;
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
