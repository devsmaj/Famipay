const {chromium}=require('../../backend/node_modules/playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'../www');
const mime={
 '.css':'text/css',
 '.html':'text/html',
 '.js':'text/javascript',
 '.json':'application/json',
 '.png':'image/png',
 '.svg':'image/svg+xml',
};
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)){response.writeHead(403).end();return;}
 fs.readFile(file,(error,body)=>{
  if(error){response.writeHead(404).end();return;}
  response.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  response.end(body);
 });
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const origin='http://127.0.0.1:'+server.address().port;
  await page.route('**/*',route=>{
   if(route.request().url().startsWith(origin+'/'))return route.continue();
   return route.abort();
  });
  await page.route('**/assets/js/platform.js',route=>route.fulfill({
   contentType:'text/javascript',
   body:`const role=new URL(location.href).searchParams.get('role')||'customer';
    const user={id:'browser-test',role,name:'Test User',email:'test@example.invalid',
      email_verified:true,phone_verified:false,onboarding_complete:true};
    window.Famina={user,authState:'authenticated',ready:Promise.resolve(),config:{},
      escape:value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),
      money:value=>String(value),notify:()=>{},refreshUser:async()=>{},
      api:async()=>[],client:{auth:{getSession:async()=>({data:{session:null},error:null}),
        signOut:async()=>({error:null})}}};`,
  }));

  for(const role of ['customer','restaurant_owner','seller','rider','admin']){
   await page.goto(`${origin}/famipay-app.html?role=${role}`);
   await page.locator('#app header').waitFor({state:'attached'});
   assert(await page.locator('#app header').count(),`missing app header for ${role}`);
   assert(await page.locator('#app main').count(),`missing private content for ${role}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }

  for(const route of ['login.html','register.html','verify-email.html']){
   await page.goto(`${origin}/${route}`);
   assert(await page.locator('main').count(),`missing page content in ${route}`);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: shared web app loads for customer, restaurant, seller, rider and admin; auth pages load without script errors.');
 }finally{
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
