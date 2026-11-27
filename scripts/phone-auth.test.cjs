const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/supabase-auth.js', 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture(page, config = {}) {
  const calls = [], events = {}, notifications = [];
  const ids = ['firebase-auth','phone-form','phone-code-form','auth-phone','auth-password','auth-confirm-password','auth-terms','already-registered','auth-code','resend-code','change-phone','sent-phone','reset-password','password-reset-form','reset-new-password','reset-confirm-password'];
  const nodes = Object.fromEntries(ids.map(id => [id, { id, value:'', checked:false, hidden:false, disabled:false, dataset:{}, focus(){}, addEventListener(name,fn){ events[id+':'+name]=fn; }, querySelector(){return button;}, setAttribute(){}, removeAttribute(){} }]));
  const button = { disabled:false };
  nodes['firebase-auth'].querySelectorAll = () => [button,nodes['resend-code'],nodes['change-phone']];
  const F = { ready:Promise.resolve(), user:null, notify:(...args)=>notifications.push(args), refreshUser:async()=>{F.user={id:'verified'};}, Cart:{merge:async()=>calls.push('merge')},client:{auth:{
    signUp:async x=>{calls.push({kind:'signup',...x});return config.signup || {data:{user:{identities:[{}]},session:null},error:null};},
    signInWithPassword:async x=>{calls.push({kind:'login',...x});return config.login || {data:{session:{access_token:'test'}},error:null};},
    signInWithOtp:async x=>{calls.push({kind:'otp',...x});return {error:null};},
    updateUser:async x=>{calls.push({kind:'update',...x});return {error:null};},
    getSession:async()=>({data:{session:{access_token:'test'}}}),
    resend:async x=>{calls.push({kind:'resend',...x});return {error:null};},
    verifyOtp:async x=>{calls.push({kind:'verify',...x});return x.token==='123456'?{data:{session:{access_token:'test'}}}:{error:Error('Invalid code')};}
  }} };
  if (config.authenticated) F.user = {id:'verified'};
  const location = {href:''};
  const context = {window:{Famina:F,FaminaLoading:{button:()=>()=>{}},addEventListener(){}},document:{body:{dataset:{authPage:page}},getElementById:id=>nodes[id] || null},location,Date,Error};
  vm.runInNewContext(source,context);
  const fire=async(id,name)=>{events[id+':'+name]({preventDefault(){},submitter:button,currentTarget:nodes[id]});await flush();await flush();};
  return {nodes,calls,notifications,location,fire};
}
test('registration requires agreement and matching passwords before signup and verification',async()=>{
  const f=fixture('register');f.nodes['auth-phone'].value='66 12 34 56';f.nodes['auth-password'].value='secure-password';f.nodes['auth-confirm-password'].value='different';
  await f.fire('phone-form','submit');assert.equal(f.calls.length,0);assert.match(f.notifications.at(-1)[0],/agree/i);
  f.nodes['auth-terms'].checked=true;await f.fire('phone-form','submit');assert.equal(f.calls.length,0);assert.match(f.notifications.at(-1)[0],/match/i);
  f.nodes['auth-confirm-password'].value='secure-password';await f.fire('phone-form','submit');assert.equal(f.calls[0].phone,'+23566123456');assert.equal(f.calls[0].kind,'signup');assert.equal(f.calls[0].options.data.terms_version,'2026-10');assert.equal(f.nodes['phone-code-form'].hidden,false);
  f.nodes['auth-code'].value='000000';await f.fire('phone-code-form','submit');assert.equal(f.location.href,'');assert.match(f.notifications.at(-1)[0],/Invalid code/);
  f.nodes['auth-code'].value='123456';await f.fire('phone-code-form','submit');assert.equal(f.location.href,'famipay-app.html');assert.ok(f.calls.includes('merge'));
});
test('duplicate registration shows login and never opens the dashboard',async()=>{
  const f=fixture('register',{signup:{error:{code:'user_already_exists',message:'User already registered'}}});f.nodes['auth-phone'].value='+23566123456';f.nodes['auth-password'].value='secure-password';f.nodes['auth-confirm-password'].value='secure-password';f.nodes['auth-terms'].checked=true;await f.fire('phone-form','submit');assert.equal(f.nodes['already-registered'].hidden,false);assert.equal(f.location.href,'');
});
test('login uses phone and password and redirects only after verified session',async()=>{
  const f=fixture('login');f.nodes['auth-phone'].value='123';f.nodes['auth-password'].value='secure-password';await f.fire('phone-form','submit');assert.equal(f.calls.length,0);
  f.nodes['auth-phone'].value='+23566123456';await f.fire('phone-form','submit');assert.equal(f.calls[0].kind,'login');assert.equal(f.calls[0].phone,'+23566123456');assert.equal(f.location.href,'famipay-app.html');
});
test('an already signed-in user is taken to the dashboard',async()=>{
  const f=fixture('login',{authenticated:true});await flush();
  assert.equal(f.location.href,'famipay-app.html');
});
test('existing SMS-only account can set a password after phone verification',async()=>{
  const f=fixture('login');f.nodes['auth-phone'].value='66123456';await f.fire('reset-password','click');
  assert.equal(f.calls[0].kind,'otp');assert.equal(f.calls[0].options.shouldCreateUser,false);
  f.nodes['auth-code'].value='123456';await f.fire('phone-code-form','submit');assert.equal(f.nodes['password-reset-form'].hidden,false);assert.equal(f.location.href,'');
  f.nodes['reset-new-password'].value='new-password';f.nodes['reset-confirm-password'].value='new-password';await f.fire('password-reset-form','submit');
  assert.ok(f.calls.some(call=>call.kind==='update' && call.password==='new-password'));assert.equal(f.location.href,'famipay-app.html');
});
