(() => {
  const track = document.querySelector('.service-track');
  const previous = document.querySelector('.service-prev');
  const next = document.querySelector('.service-next');
  const counter = document.querySelector('.service-counter');
  if (!track || !previous || !next || !counter) return;
  const cards = [...track.querySelectorAll('.service-slide')];
  if (!cards.length) return;
  let current = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function update() {
    const bounds = track.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === 'rtl';
    const start = rtl ? bounds.right : bounds.left;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const diff = Math.abs((rtl ? rect.right : rect.left) - start);
      if (diff < distance) { distance = diff; current = index; }
    });
    const first = cards[0].getBoundingClientRect();
    const last = cards.at(-1).getBoundingClientRect();
    previous.disabled = rtl ? first.right <= bounds.right + 2 : first.left >= bounds.left - 2;
    next.disabled = rtl ? last.left >= bounds.left - 2 : last.right <= bounds.right + 2;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  function move(direction) {
    const card = cards[Math.max(0, Math.min(cards.length - 1, current + direction))];
    const bounds = track.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === 'rtl';
    track.scrollBy({ left: rtl ? rect.right - bounds.right : rect.left - bounds.left, behavior: reduced.matches ? 'auto' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
