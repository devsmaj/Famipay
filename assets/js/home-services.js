(() => {
  const buttons = [...document.querySelectorAll('[data-service-details]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.serviceDetails);
    if (!target) return;
    const opening = target.hidden;
    buttons.forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      const panel = document.getElementById(other.dataset.serviceDetails);
      if (panel) panel.hidden = true;
    });
    if (opening) {
      target.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  }));
})();
