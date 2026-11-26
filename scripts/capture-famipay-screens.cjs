// Capture the real frontend with isolated, empty fixture data.
const { chromium } = require('../backend/node_modules/playwright');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await page.setContent('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="app"></div></body></html>');
    await page.addStyleTag({ path: path.join(root, 'assets/css/famipay-app.css') });
    await page.evaluate(() => {
      window.Famina = { user: {id:'fixture',name:'Customer',role:'customer'}, escape: s => String(s ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])), api: async () => [], client: {auth:{signOut:async()=>({})}} };
      window.FaminaSession = { getPreference: () => 'en', setPreference() {} };
    });
    await page.addScriptTag({path:path.join(root,'assets/js/famipay-translations.js')});
    await page.addScriptTag({path:path.join(root,'assets/js/famipay-app.js')});
    for (const [filename, route] of [['home','Home'],['services','Services'],['wallet','Wallet'],['orders','Orders'],['profile','Me']]) {
      await page.evaluate(route => { location.hash = encodeURIComponent(route); }, route);
      await page.waitForTimeout(150);
      await page.screenshot({path:path.join(root, 'assets/images/famipay-screen-'+filename+'.png')});
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
