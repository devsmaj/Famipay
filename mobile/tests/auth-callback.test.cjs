const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function callbackFixture(error=null){
 const calls=[],redirects=[];
 const context={URL,Capacitor:{isNativePlatform:()=>false},Browser:{close:async()=>calls.push('close')},location:{replace:value=>redirects.push(value)},window:{Famina:{ready:Promise.resolve(),client:{auth:{exchangeCodeForSession:async code=>{calls.push(code);return{error};}}}},FaminaNotifications:{show:()=>{}}}};
 const source=fs.readFileSync(path.resolve(__dirname,'../src/native.js'),'utf8').replace(/^import .*;\r?\n/gm,'').split('async function boot()')[0];
 vm.runInNewContext(source+'\nglobalThis.callback=handleAuthCallback;',context);
 return{callback:context.callback,calls,redirects};
}
test('native email verification exchanges the Supabase code in the existing app session',async()=>{
 const f=callbackFixture();assert.equal(await f.callback('famipay://auth/login?code=confirmation-code'),true);assert.deepEqual(f.calls,['confirmation-code','close']);assert.deepEqual(f.redirects,['verify-email.html']);
});
test('native recovery preserves the website password recovery flow',async()=>{
 const f=callbackFixture();await f.callback('famipay://auth/login?code=recovery-code&recovery=1');assert.deepEqual(f.redirects,['login.html?recovery=1']);
});
test('foreign and incomplete callbacks cannot open the private dashboard',async()=>{
 const f=callbackFixture();assert.equal(await f.callback('https://example.invalid/auth/login?code=bad'),false);assert.equal(await f.callback('famipay://other/login?code=bad'),false);await assert.rejects(f.callback('famipay://auth/login'));assert.deepEqual(f.calls,[]);assert.deepEqual(f.redirects,[]);
});
test('failed code exchange never redirects into the dashboard',async()=>{
 const f=callbackFixture(Error('expired'));await assert.rejects(f.callback('famipay://auth/login?code=expired'));assert.deepEqual(f.redirects,[]);
});
