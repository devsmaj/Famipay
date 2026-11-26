// Local browser fixtures only; no production writes or real-money operations.
const {chromium}=require('../backend/node_modules/playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(body);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try {
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/assets/js/platform.js',route=>route.fulfill({contentType:'text/javascript',body:`window.Famina={ready:Promise.resolve(),user:{id:'customer',name:'Browser Customer',role:'customer'},escape:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),retryAuth:async()=>{},api:async(path,opts)=>{window.testCalls??=[];window.testCalls.push({path,opts});if(path==='/restaurants')return[{id:'r',name:'Test restaurant'}];if(path==='/menu')return[{id:'i',restaurant_id:'r',name:'Test meal',price:1000,available:true}];if(path==='/cart')return[{id:'i',name:'Test meal',price:1000,quantity:1}];if(path==='/addresses')return[{id:'a',label:'Home',address:'Test address'}];if(path==='/quotes')return{id:'q',subtotal:1000,delivery_fee:500,total:1500};if(path==='/orders'&&opts?.method==='POST')return{id:'o'};if(path==='/orders/o')return{id:'o',status:'pending',total:1500,order_events:[]};return[];},client:{auth:{signOut:async()=>({})}}};` }));
  await page.goto(origin+'/famipay-app.html');
  await page.locator('[data-open="Food Delivery"]').click();
  await page.locator('[data-restaurant="r"]').click();await page.locator('[data-add="i"]').click();
  await page.locator('[data-open="Cart"]').click();await page.locator('[data-open="Checkout"]').click();
  await page.locator('[data-form="quote"] button[type="submit"]').click();
  await page.locator('[data-action="checkout"]').click();await page.waitForFunction(()=>document.querySelector('#fp-content')?.textContent.includes('pending'));
  const quoteCall=await page.evaluate(()=>window.testCalls.find(c=>c.path==='/quotes'));assert.equal(quoteCall.opts.body.addressId,'a');
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});
   for(const language of ['en','fr','ar']){
    await page.goto(origin+'/famipay-app.html#Home');await page.locator('#language').selectOption(language);
    assert.equal(await page.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+width+' '+language);
    for(const tab of ['Wallet','Services','Orders','Me','Home']){await page.locator('[data-tab="'+tab+'"]').click();await page.locator('nav').waitFor();}
   }
  }
  await page.locator('#language').selectOption('en');await page.locator('[data-open="Send Money"]').click();
  await page.locator('#recipient').fill('+23512345678');await page.locator('#amount').fill('5000');await page.locator('[data-form="payment"] button').click();
  assert(await page.getByRole('button',{name:'Confirm transaction',exact:true}).isDisabled());
  await page.goto(origin+'/famipay-private-preview.html');await page.locator('.grid').waitFor();
  await page.screenshot({path:path.join(os.tmpdir(),'famipay-reference.png'),fullPage:true});
  await page.goto(origin+'/famipay-app.html');await page.locator('.grid').waitFor();
  await page.screenshot({path:path.join(os.tmpdir(),'famipay-live.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  await page.unroute('**/assets/js/platform.js');
  await page.route('**/assets/js/platform.js',route=>route.fulfill({contentType:'text/javascript',body:'window.Famina={ready:Promise.resolve(),user:null};'}));
  await page.goto(origin+'/famipay-app.html');await page.getByRole('link',{name:'Login / Sign up'}).waitFor();assert(await page.locator('#app').isHidden());
  console.log('PASS: Chrome checkout, financial guard, sign-in gate, 4 widths × 3 languages; screenshots: '+os.tmpdir());
 } finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
