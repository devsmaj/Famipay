const path=require('node:path'),fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.FAMIPAY_PLAYWRIGHT_MODULE||'../../backend/node_modules/playwright');
const root=path.resolve(__dirname,'../www');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(body);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
  const page=await browser.newPage(),origin='http://127.0.0.1:'+server.address().port,errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>{if(!route.request().url().startsWith(origin+'/')){external.push(route.request().url());return route.abort();}return route.continue();});
  for(const width of [320,390,768])for(const language of ['en','fr','ar']){
   await page.setViewportSize({width,height:850});await page.goto(origin+'/famipay-app.html');await page.locator('#language').selectOption(language);
   for(const screen of ['Home','Wallet','Services','Transactions','Me','Notifications','Send Money','Security & PIN']){
    await page.evaluate(value=>location.hash=encodeURIComponent(value),screen);await page.waitForTimeout(40);
    assert(await page.locator('#preview-banner').isVisible());assert.equal(await page.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+language+' '+screen);
    assert.doesNotMatch(await page.locator('#app').innerText(),/Food Delivery|restaurant|livraison de repas|توصيل الطعام/);
   }
  }
  await page.goto(origin+'/famipay-app.html#Personal%20Information');await page.locator('#name').fill('Phone preview reviewer');await page.locator('[data-form="profile"] button').click();await page.waitForFunction(()=>window.Famina.user.name==='Phone preview reviewer');
  await page.reload();await page.waitForFunction(()=>window.Famina.user.name==='Phone preview reviewer');
  await page.goto(origin+'/famipay-app.html#Send%20Money');await page.locator('#language').selectOption('en');await page.locator('#recipient').fill('+23512345678');await page.locator('#amount').fill('1000');await page.locator('[data-form="payment"] button').click();
  assert(await page.getByRole('button',{name:'Confirm transaction',exact:true}).isDisabled());assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  await page.setViewportSize({width:390,height:850});await page.goto(origin+'/famipay-app.html#Home');await page.locator('.home-grid').waitFor();await page.screenshot({path:path.resolve(__dirname,'../preview.png'),fullPage:true});
  console.log('PASS: offline preview opens without auth, EN/FR/AR layout, profile persistence, no external requests, financial writes disabled.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
