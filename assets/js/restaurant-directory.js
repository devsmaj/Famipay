(() => {
  const model = window.FaminaDirectoryModel;
  const results = document.getElementById('restaurant-results');
  if (!results || !model) return;
  const t = text => window.i18n?.translateText(text) || text;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeLink = url => { try { const parsed = new URL(url); return parsed.protocol === 'https:' ? escape(parsed.href) : ''; } catch (_) { return ''; } };
  const filter = document.getElementById('directory-filters');
  const search = document.getElementById('restaurant-search');
  const sort = document.getElementById('restaurant-sort');
  const count = document.getElementById('directory-count');
  const pagination = document.getElementById('directory-pagination');
  let rows = model.merge(window.FAMINA_ABECHE_RESTAURANTS || [], []);
  let point = null, page = 1, cuisines = [], orderable = false;
  const initialCuisine = new URLSearchParams(location.search).get('cuisine');
  if (initialCuisine && rows.some(row=>model.tags(row).includes(initialCuisine))) cuisines = [initialCuisine];
  try {
    const saved = JSON.parse(sessionStorage.getItem('famina-delivery-draft') || 'null');
    if (model.validPoint(saved) && typeof saved.address === 'string') {
      point = saved;
      const address = document.getElementById('directory-address');
      address.textContent = saved.address;
      address.setAttribute('data-no-translate','');
    }
  } catch (_) { /* Browsing remains available without a saved point. */ }
  sort.querySelector('[value=distance]').disabled = !point;
  function renderCuisines() {
    const tags = [...new Set(rows.flatMap(model.tags))].sort();
    document.getElementById('directory-cuisines').innerHTML = tags.map(tag => `<label class="directory-check"><input type="checkbox" name="cuisine" value="${escape(tag)}"${cuisines.includes(tag)?' checked':''}> ${escape(t(tag))}</label>`).join('');
  }
  function render() {
    const nearest = sort.querySelector('[value=distance]');
    nearest.disabled = !point || !rows.some(model.validPoint);
    if (nearest.disabled && sort.value === 'distance') sort.value = 'featured';
    const selection = model.select(rows,{query:search.value,cuisines,orderable,sort:sort.value,point,page});
    page = selection.page;
    count.textContent = `${selection.total} ${t('restaurants')} · ${t('Abéché')}`;
    results.innerHTML = selection.rows.length ? selection.rows.map((row,index) => {
      const initials = row.name.split(/\s+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();
      const photo = row.partner && safeLink(row.image);
      const badge = row.partner ? (row.available ? 'Ordering available' : 'Not accepting orders') : 'Directory listing';
      const km = point ? model.distance(point,row) : null;
      const source = safeLink(row.source);
      const phone = /^\+235\d{8}$/.test(row.phone || '') ? `<a href="tel:${escape(row.phone)}">${t('Call restaurant')}</a>` : '';
      return `<article class="directory-row">
        <div class="directory-monogram color-${index%4}" aria-hidden="true">${escape(initials)}${photo?`<img src="${photo}" alt="" loading="lazy">`:''}</div>
        <div class="directory-row-copy"><div class="directory-row-heading"><h2 data-no-translate>${escape(row.name)}</h2><span class="directory-badge ${row.partner && row.available?'is-orderable':''}">${escape(t(badge))}</span></div>
        <p class="directory-row-cuisine">${model.tags(row).map(tag => escape(t(tag))).join(' · ')}</p>
        <p class="directory-row-address" data-no-translate>${escape(row.address || 'Abéché')}${km !== null ? ` · ${km.toFixed(1)} km (${escape(t('straight-line distance'))})`:''}</p>
        <p class="directory-row-status">${escape(t(row.partner ? 'Delivery charges are calculated at checkout.' : 'Delivery and menu availability are not yet confirmed.'))}</p>
        <div class="directory-row-links">${row.partner?`<a class="directory-menu-link" href="menu.html?restaurant=${encodeURIComponent(row.id)}">${escape(t('View Menu'))} <span aria-hidden="true">↗</span></a>`:''}${phone}${source?`<a href="${source}" target="_blank" rel="noopener noreferrer">${escape(t('Listing source'))} · ${escape(row.sourceName)}</a>`:''}</div>
        ${row.needsReview?`<small class="directory-review-note">${escape(t('Business details need confirmation.'))}</small>`:''}
        </div></article>`;
    }).join('') : `<div class="directory-empty"><h2>${escape(t('No restaurants match your filters.'))}</h2><p>${escape(t('Try another search or clear your filters.'))}</p><button type="button" id="directory-empty-reset">${escape(t('Clear filters'))}</button></div>`;
    results.querySelectorAll('.directory-monogram img').forEach(img => img.addEventListener('error',()=>img.remove(),{once:true}));
    pagination.innerHTML = `<button type="button" data-page="${page-1}" aria-label="Previous page"${page===1?' disabled':''}>←</button>` + Array.from({length:selection.pages},(_,i) => `<button type="button" data-page="${i+1}" aria-label="Page ${i+1}"${i+1===page?' aria-current="page"':''}>${i+1}</button>`).join('') + `<button type="button" data-page="${page+1}" aria-label="Next page"${page===selection.pages?' disabled':''}>→</button>`;
    results.querySelector('#directory-empty-reset')?.addEventListener('click',reset);
    window.FaminaLoading?.ready?.();
  }
  function reset() {
    search.value = '';
    cuisines = [];
    orderable = false;
    page = 1;
    sort.value = 'featured';
    filter.querySelectorAll('input').forEach(input => input.checked = false);
    render();
  }
  filter.addEventListener('submit',event => {
    event.preventDefault();
    cuisines = [...filter.querySelectorAll('[name=cuisine]:checked')].map(input=>input.value);
    orderable = filter.querySelector('[name=orderable]').checked;
    page = 1;
    render();
  });
  filter.addEventListener('reset',event => { event.preventDefault(); reset(); });
  search.addEventListener('input',()=>{ page=1; render(); });
  sort.addEventListener('change',()=>{ page=1; render(); });
  pagination.addEventListener('click',event=>{
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    render();
    count.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  document.addEventListener('languagechange',()=>{ renderCuisines(); render(); });
  renderCuisines();
  render();
  // Sourced listings stay visible even while the business API is unavailable.
  (async () => {
    try {
      const response = await fetch(window.FAMINA_API_BASE+'/restaurants',{signal:AbortSignal.timeout(8000)});
      if (!response.ok) throw Error('Directory API unavailable');
      const partners = await response.json();
      if (!Array.isArray(partners)) throw Error('Invalid restaurant data');
      rows = model.merge(window.FAMINA_ABECHE_RESTAURANTS || [],partners);
      renderCuisines();
      render();
    } catch (_) {
      document.getElementById('directory-notice').textContent = t('Showing local directory listings. Online ordering is currently unavailable.');
    }
  })();
})();
