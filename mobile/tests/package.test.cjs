const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'www');
test('native package retains the original FAMIPAY identity and local Capacitor app',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(root,'capacitor.config.json')));
 assert.equal(config.appName,'FAMIPAY');assert.equal(config.appId,'com.famipay.app');assert.equal(config.webDir,'www');assert.equal(config.server.url,undefined);
});
test('package contains the website login, signup, verification and unchanged onboarding pages',()=>{
 for(const file of ['famipay-app.html','login.html','register.html','verify-email.html','famipay-onboarding.html'])
  assert(fs.existsSync(path.join(out,file)),file);
 const original=fs.readFileSync(path.resolve(root,'../famipay-onboarding.html'),'utf8');
 const packaged=fs.readFileSync(path.join(out,'famipay-onboarding.html'),'utf8')
  .replace('    <link rel="stylesheet" href="native.css">\n','')
  .replace('    <script src="native-config.js"></script>\n','')
  .replace('    <script src="native.js"></script>\n','');
 assert.equal(packaged,original,'onboarding page design and markup must remain unchanged');
});
test('all packaged private-page assets exist and the original role-aware controller is used',()=>{
 const app=fs.readFileSync(path.join(out,'assets/js/famipay-app.js'),'utf8');
 const shell=fs.readFileSync(path.join(out,'famipay-app.html'),'utf8');
 for(const role of ['restaurant_owner','seller','rider','admin'])assert(shell.includes(`${role}:`),role);
 for(const route of ['merchant-dashboard','catalog-management','rider-dashboard','admin-dashboard','transaction-history','wallet'])
  assert(app.includes(route),route);
 assert(shell.includes('assets/js/famipay-app.js'));
 assert(shell.includes('assets/js/platform.js'));
 assert(shell.includes('assets/js/famipay-navigation.js'));
 assert(shell.includes('assets/vendor/supabase.js'));
});
test('all packaged private and auth pages reference present assets',()=>{
 for(const file of fs.readdirSync(out).filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(path.join(out,file),'utf8');
  for(const [,asset] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|svg))(?:\?[^"]*)?"/g))assert(fs.existsSync(path.join(out,asset)),file+': '+asset);
 }
});
test('Android email confirmation uses the existing FAMIPAY app-link callback',()=>{
 const auth=fs.readFileSync(path.join(out,'assets/js/supabase-auth.js'),'utf8');
 const verify=fs.readFileSync(path.join(out,'assets/js/verify-email.js'),'utf8');
 assert(auth.includes('famipay://auth/login'));
 assert(verify.includes('famipay://auth/login'));
 const native=fs.readFileSync(path.join(out,'native.js'),'utf8');
 assert(native.includes('exchangeCodeForSession'));
 assert(native.includes('verify-email.html'));
 const navigation=fs.readFileSync(path.join(out,'assets/js/famipay-navigation.js'),'utf8');
 assert(navigation.includes('window.FaminaNativeApp'));
});
