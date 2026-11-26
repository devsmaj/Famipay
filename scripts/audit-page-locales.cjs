const fs = require('node:fs');
const english = JSON.parse(fs.readFileSync('assets/locales/en.json', 'utf8'));
const known = new Set();
function collect(value) {
  if (typeof value === 'string') known.add(value);
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    if (key === 'text') Object.keys(child).forEach(text => known.add(text));
    else collect(child);
  }
}
collect(english);
for (const file of fs.readdirSync('.').filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8').replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const missing = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1].replace(/\s+/g, ' ').trim())
    .filter(text => /[A-Za-z]{3}/.test(text) && !known.has(text));
  if (missing.length) console.log(file + ': ' + [...new Set(missing)].join(' | '));
}
