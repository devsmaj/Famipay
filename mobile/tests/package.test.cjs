const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'www');
test('native package is separately named FAMIPAY and uses local bundled assets',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(root,'capacitor.config.json')));
 assert.equal(config.appName,'FAMIPAY');assert.equal(config.appId,'com.famipay.app');assert.equal(config.webDir,'www');assert.equal(config.server.url,undefined);
});
test('package excludes commerce screens and controllers, including stale output',()=>{
 const files=fs.readdirSync(out);assert.deepEqual(files.filter(f=>f.endsWith('.html')).sort(),['famipay-app.html','index.html','legal.html','login.html','register.html']);
 const js=fs.readdirSync(path.join(out,'assets/js'));
 for(const file of ['cart-state.js','restaurant-directory.js','famipay-app.js','navigation.js','main.js'])assert(!js.includes(file),file);
 const app=fs.readFileSync(path.join(out,'app.js'),'utf8');
 assert.doesNotMatch(app,/Food Delivery|Restaurant Menu|Cash on delivery|Online Shop|Agriculture|\/orders|\/cart|\/restaurants|\/quotes/);
 assert.match(app,/Transactions/);assert.match(app,/Confirm transaction/);
});
test('all emitted pages reference available bundled scripts and styles',()=>{
 for(const file of fs.readdirSync(out).filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(path.join(out,file),'utf8');
  for(const [,asset] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|svg))(?:\?[^"]*)?"/g))assert(fs.existsSync(path.join(out,asset)),file+': '+asset);
 }
});
test('financial services have no fabricated balances or successful payment endpoint',()=>{
 const app=fs.readFileSync(path.join(out,'app.js'),'utf8');
 assert.doesNotMatch(app,/F\.api\("\/(payments|transfers|wallet)/);assert.match(app,/disabled/);assert.match(app,/Wallet not connected/);
});
