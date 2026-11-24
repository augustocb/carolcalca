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
