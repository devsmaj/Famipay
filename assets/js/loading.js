/* FAMIPAY loading utilities: no page, header, or image skeletons. */
(function () {
  if (window.FaminaLoading) return;
  document.documentElement.classList.remove('page-loading', 'header-loading');
  const buttons = new WeakMap();
  function start() { return () => {}; }
  function request() { return () => {}; }
  function button(element) {
    if (!element) return () => {};
    if (buttons.has(element)) return buttons.get(element);
    const disabled = element.disabled;
    const busy = element.getAttribute('aria-busy');
    const ring = document.createElement('span');
    ring.className = 'button-loading-ring';
    ring.setAttribute('aria-hidden', 'true');
    element.append(ring);
    element.classList.add('button-loading');
    element.setAttribute('aria-busy', 'true');
    if ('disabled' in element) element.disabled = true;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      ring.remove();
      element.classList.remove('button-loading');
      if (busy === null) element.removeAttribute('aria-busy');
      else element.setAttribute('aria-busy', busy);
      if ('disabled' in element) element.disabled = disabled;
      buttons.delete(element);
    };
    buttons.set(element, done);
    return done;
  }
  function reveal() { document.documentElement.classList.remove('page-loading', 'header-loading'); }
  window.FaminaLoading = {
    start, button, request,
    resolveGuard: reveal,
    ready: reveal,
    componentFailed(id) {
      if (id !== 'header') return;
      reveal();
      const header = document.getElementById('header');
      if (!header) return;
      const error = document.createElement('div');
      error.className = 'header-component-error';
      error.setAttribute('role', 'alert');
      const message = 'Could not load this page section. Please refresh and try again.';
      error.textContent = window.i18n?.translateText(message) || message;
      header.replaceChildren(error);
    }
  };
  document.addEventListener('DOMContentLoaded', reveal);
  window.addEventListener('pageshow', reveal);
})();
