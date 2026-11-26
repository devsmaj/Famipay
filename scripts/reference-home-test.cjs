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
    assert(await page.locator('.hero-real-screen img').evaluate(el=>el.complete && el.naturalWidth>0));
    assert(await page.locator('.famina-brand-image').evaluate(el=>el.complete && el.naturalWidth>0));
    await page.locator('[data-home-menu="products"]').waitFor();
    const checkChevrons = async () => {
      const alignment=await page.locator('[data-home-menu] .home-chevron').evaluateAll(nodes=>nodes.map(node=> {
        const icon=node.getBoundingClientRect(), text=node.previousElementSibling.getBoundingClientRect();
        return Math.abs((icon.top+icon.height/2)-(text.top+text.height/2));
      }));
      assert(alignment.every(delta=>delta<2),'Menu chevrons must align with their labels: '+alignment);
    };
    await checkChevrons();
    for(const menu of ['products','explore','company','download']) {
      const trigger=page.locator('[data-home-menu="'+menu+'"]');
      await trigger.click();
      assert.equal(await trigger.getAttribute('aria-expanded'),'true');
      assert(await page.locator('#home-menu-'+menu).isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await trigger.getAttribute('aria-expanded'),'false');
      assert(await page.locator('#home-menu-'+menu).isHidden());
    }
    await page.evaluate(()=>window.scrollTo(0,500));
    await page.waitForFunction(()=>document.querySelector('.header')?.classList.contains('home-scrolled'));
    await page.evaluate(()=>window.scrollTo(0,0));
    const localLinks=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')).filter(h=>h&&!h.startsWith('#')&&!/^(https?:|mailto:|tel:)/.test(h)));
    for(const href of new Set(localLinks)) {
      const response=await page.request.get(new URL(href,'http://127.0.0.1:'+server.address().port+'/index.html').href);
      assert(response.ok(), 'Broken homepage link: '+href+' ('+response.status()+')');
    }
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('.hamburger').click();
    await checkChevrons();
    const authLayout=await page.locator('#auth-links').evaluate(el=>[...el.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),...Object.fromEntries(['top','height','left','right'].map(k=>[k,a.getBoundingClientRect()[k]]))})));
    assert.deepEqual(authLayout.map(a=>a.href),['login.html','register.html']);
    assert(Math.abs(authLayout[0].top-authLayout[1].top)<2 && authLayout[0].height>=44 && authLayout[1].height>=44,'Mobile account actions should be side by side with touch-sized targets');
    assert(await page.locator('.mobile-menu-brand').isVisible());
    assert(await page.locator('.close-menu').isVisible());
    await page.locator('[data-home-menu="explore"]').click();
    assert(await page.locator('#home-menu-explore').isVisible());
    await page.keyboard.press('Escape');
    assert(await page.locator('#home-menu-explore').isHidden());
    await page.locator('.close-menu').click();
    assert.equal(await page.locator('.hamburger').getAttribute('aria-expanded'),'false');
    await page.locator('.reference-next').click();
    await page.waitForTimeout(500);
    assert(await page.locator('.reference-track').evaluate(el=>el.scrollLeft>0));
    await page.setViewportSize({width:1024,height:768});
    await page.locator('.hamburger').click();
    await checkChevrons();
    await page.locator('[data-home-menu="company"]').click();
    assert(await page.locator('#home-menu-company').isVisible());
    await page.locator('.close-menu').click();
    await page.setViewportSize({width:1366,height:900});
    let referenceHeader;
    for(const file of ['services.html','about.html','contact.html','faq.html','privacy.html','terms.html','login.html','register.html']) {
      await page.goto('http://127.0.0.1:'+server.address().port+'/'+file);
      await page.locator('.header .nav-list [data-navigation-link]').first().waitFor();
      const values=await page.evaluate(() => ({
        height:document.querySelector('.header .container').getBoundingClientRect().height,
        size:getComputedStyle(document.querySelector('.header .nav-list a')).fontSize,
        links:[...document.querySelectorAll('.header .nav-list a')].map(a=>a.getAttribute('href'))
      }));
      assert.deepEqual(values.links,['services.html','about.html','contact.html'],file);
      if(!referenceHeader)referenceHeader=values;
      else {assert.equal(values.height,referenceHeader.height,file+' header height');assert.equal(values.size,referenceHeader.size,file+' header text');}
    }
    await page.goto('http://127.0.0.1:'+server.address().port+'/services.html');
    assert.equal(await page.locator('.service-detail').count(),3);
    assert.equal(await page.locator('.service-detail a').first().getAttribute('href'),'restaurant.html');
    await page.goto('http://127.0.0.1:'+server.address().port+'/about.html');
    assert.equal(await page.locator('.fp-about').count(),1);
    console.log('Home page: hero and actual screens loaded, mobile layout and carousel work.');
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
