(() => {
  const track = document.querySelector('.reference-track');
  const previous = document.querySelector('.reference-prev');
  const next = document.querySelector('.reference-next');
  if (!track || !previous || !next) return;
  const update = () => {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
  };
  previous.addEventListener('click', () => track.scrollBy({left:-230,behavior:'smooth'}));
  next.addEventListener('click', () => track.scrollBy({left:230,behavior:'smooth'}));
  track.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
