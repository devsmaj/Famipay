const {chromium} = require('../backend/node_modules/playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)) return res.writeHead(403).end();
  fs.readFile(file,(error,data) => {
    if(error) return res.writeHead(404).end();
    res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser = await chromium.launch({channel:'chrome',headless:true});
    const page = await browser.newPage({viewport:{width:1366,height:900}});
    await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');
    await page.locator('.reference-device img').first().waitFor();
    assert.equal(await page.locator('.reference-service').count(),5);
    assert(await page.locator('.reference-hero-phone').evaluate(el=>el.complete && el.naturalWidth>0));
    assert(await page.locator('.famina-brand-image').evaluate(el=>el.complete && el.naturalWidth>0));
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('.reference-next').click();
    await page.waitForTimeout(500);
    assert(await page.locator('.reference-track').evaluate(el=>el.scrollLeft>0));
    console.log('Home page: hero and actual screens loaded, mobile layout and carousel work.');
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
