const {chromium}=require('../../backend/node_modules/playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../www');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,body)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(body);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
  const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',req=>requests.push(req.url()));
  await page.route('**/assets/js/platform.js',route=>route.fulfill({contentType:'text/javascript',body:`window.Famina={user:{id:'test',name:'Test customer',email:'test@example.invalid'},ready:Promise.resolve(),escape:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),api:async(path,opts)=>{window.calls??=[];window.calls.push({path,opts});return{};},retryAuth:async()=>{},client:{auth:{signOut:async()=>({})}}};`}));
  const origin='http://127.0.0.1:'+server.address().port;
  for(const width of [320,390,768])for(const lang of ['en','fr','ar']){
   await page.setViewportSize({width,height:850});await page.goto(origin+'/famipay-app.html');await page.locator('#language').selectOption(lang);
   for(const screen of ['Home','Wallet','Services','Transactions','Me','Send Money','Receive Money','Mobile Money','Add Money','Withdraw','Bank Transfer','Airtime','Mobile Data','Pay Bills','QR Payment','Merchant Payments','Agent Services','Personal Information','Identity Verification','Security & PIN','Language','Help & Support','Notifications']){
    await page.evaluate(value=>location.hash=encodeURIComponent(value),screen);await page.waitForFunction(value=>decodeURIComponent(location.hash.slice(1))===value,screen);await page.waitForTimeout(30);
    assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+screen+' '+width+' '+lang);
    assert.doesNotMatch(await page.locator('#app').innerText(),/food delivery|restaurant|livraison de repas|توصيل الطعام|undefined/i);
   }
  }
  await page.goto(origin+'/famipay-app.html#Send%20Money');await page.locator('#language').selectOption('en');
  await page.locator('#recipient').fill('<img src=x onerror=alert(1)>');await page.locator('#amount').fill('5000');await page.locator('[data-form="payment"] button').click();
  await page.getByRole('button',{name:'Confirm transaction',exact:true}).waitFor();assert(await page.getByRole('button',{name:'Confirm transaction',exact:true}).isDisabled());
  assert.equal(await page.locator('#fp-content img').count(),0);assert.equal(await page.evaluate(()=>window.calls?.length||0),0);
  await page.goto(origin+'/famipay-app.html#Personal%20Information');await page.locator('#name').fill('Updated customer');await page.locator('[data-form="profile"] button').click();await page.waitForFunction(()=>window.calls?.length===1);
  assert.equal((await page.evaluate(()=>window.calls[0])).path,'/profile');
  await page.setViewportSize({width:390,height:850});await page.goto(origin+'/famipay-app.html#Home');await page.locator('.home-grid').waitFor();await page.locator('#language').selectOption('en');await page.screenshot({path:path.resolve(__dirname,'../preview.png'),fullPage:true});
  await page.unroute('**/assets/js/platform.js');await page.route('**/assets/js/platform.js',route=>route.fulfill({contentType:'text/javascript',body:'window.Famina={user:null,ready:Promise.resolve(),escape:s=>String(s)};'}));
  await page.goto(origin+'/famipay-app.html');await page.locator('a[href="login.html"]').waitFor();
  for(const pageName of ['login','register']){await page.goto(origin+'/'+pageName+'.html');await page.locator('#auth-email').waitFor();assert(await page.locator('#auth-email').isVisible());assert(await page.locator('#auth-password').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  assert.deepEqual(errors,[]);assert(!requests.some(url=>/\/(restaurants|cart|orders|quotes)(?:[/?]|$)/.test(url)));
  console.log('PASS: financial-only navigation, 3 languages × 3 widths, payment guard, profile, auth forms; no commerce requests.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
