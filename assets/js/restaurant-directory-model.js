(function (root) {
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const nameKey = value => normalize(value).replace(/^restaurant\s+/, '');
  const validPoint = p => p && Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180;
  function distance(a, b) {
    if (!validPoint(a) || !validPoint(b)) return null;
    const rad = n => n * Math.PI / 180;
    const h = Math.sin(rad(b.latitude-a.latitude)/2)**2 + Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(rad(b.longitude-a.longitude)/2)**2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1,h)));
  }
  const tags = row => String(row.cuisine || 'Not specified').split(/[,;/]/).map(t => t.trim()).filter(Boolean);
  function merge(directory, partners) {
    const rows = directory.map(row => ({ ...row, partner:false }));
    for (const partner of partners) {
      if (partner.approved !== true) continue;
      const fromCenter = distance({latitude:13.829,longitude:20.832},partner);
      if (!((fromCenter !== null && fromCenter <= 25) || /abeche/.test(normalize(partner.address || partner.city)))) continue;
      const index = rows.findIndex(row => [row.name,...(row.aliases || [])].some(name => nameKey(name) === nameKey(partner.name)));
      const row = { ...(index >= 0 ? rows[index] : {}), ...partner, partner:true };
      if (index >= 0) rows[index] = row; else rows.push(row);
    }
    return rows;
  }
  function select(rows, {query='', cuisines=[], orderable=false, sort='featured', point=null, page=1, pageSize=5}={}) {
    const q = normalize(query);
    const filtered = rows.filter(row => (!q || normalize([row.name,row.address,row.cuisine,...(row.aliases || [])].join(' ')).includes(q)) && (!orderable || (row.partner && row.available === true)) && (!cuisines.length || tags(row).some(t => cuisines.includes(t))));
    filtered.sort((a,b) => {
      if (sort === 'distance') return (distance(point,a) ?? Infinity) - (distance(point,b) ?? Infinity) || a.name.localeCompare(b.name);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return Number(Boolean(b.partner && b.available)) - Number(Boolean(a.partner && a.available)) || a.name.localeCompare(b.name);
    });
    const pages = Math.max(1,Math.ceil(filtered.length/pageSize));
    const current = Math.max(1,Math.min(pages,Number(page)||1));
    return { rows:filtered.slice((current-1)*pageSize,current*pageSize), total:filtered.length, page:current, pages };
  }
  const model = { normalize, validPoint, distance, tags, merge, select };
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.FaminaDirectoryModel = model;
})(globalThis);
