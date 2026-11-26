const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/supabase-auth.js', 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture(page) {
  const calls = [], events = {}, notifications = [];
  const ids = ['firebase-auth','phone-form','phone-code-form','auth-phone','auth-code','resend-code','change-phone','sent-phone'];
  const nodes = Object.fromEntries(ids.map(id => [id, { id, value:'', hidden:false, disabled:false, dataset:{}, focus(){}, addEventListener(name,fn){ events[id+':'+name]=fn; }, querySelector(){return button;}, setAttribute(){}, removeAttribute(){} }]));
  const button = { disabled:false };
  nodes['firebase-auth'].querySelectorAll = () => [button,nodes['resend-code'],nodes['change-phone']];
  const F = { ready:Promise.resolve(), user:null, notify:(...args)=>notifications.push(args), refreshUser:async()=>{F.user={id:'verified'};}, Cart:{merge:async()=>calls.push('merge')},client:{auth:{signInWithOtp:async x=>{calls.push(x);return {error:null};},verifyOtp:async x=>{calls.push(x);return x.token==='123456'?{data:{session:{access_token:'test'}}}:{error:Error('Invalid code')};}}} };
  const location = {href:''};
  const context = { window:{Famina:F,FaminaLoading:{button:()=>()=>{}},addEventListener(){}},document:{body:{dataset:{authPage:page}},getElementById:id=>nodes[id]},location,Date,Error };
  vm.runInNewContext(source,context);
  const fire=async(id,name)=>{events[id+':'+name]({preventDefault(){},submitter:button,currentTarget:nodes[id]});await flush();await flush();};
  return {nodes,calls,notifications,location,fire};
}
test('registration verifies a Chad number before dashboard access',async()=>{
  const f=fixture('register'); f.nodes['auth-phone'].value='66 12 34 56'; await f.fire('phone-form','submit');
  assert.equal(f.calls[0].phone,'+23566123456');assert.equal(f.calls[0].options.shouldCreateUser,true);assert.equal(f.nodes['phone-form'].hidden,true);assert.equal(f.nodes['phone-code-form'].hidden,false);
  f.nodes['auth-code'].value='000000';await f.fire('phone-code-form','submit');assert.equal(f.location.href,'');assert.match(f.notifications.at(-1)[0],/Invalid code/);
  f.nodes['auth-code'].value='123456';await f.fire('phone-code-form','submit');assert.equal(f.location.href,'famipay-app.html');assert.ok(f.calls.includes('merge'));
});
test('login does not create accounts and supports changing the number',async()=>{
  const f=fixture('login');f.nodes['auth-phone'].value='123';await f.fire('phone-form','submit');assert.equal(f.calls.length,0);
  f.nodes['auth-phone'].value='+23566123456';await f.fire('phone-form','submit');assert.equal(f.calls[0].options.shouldCreateUser,false);
  await f.fire('resend-code','click');assert.match(f.notifications.at(-1)[0],/wait/i);await f.fire('change-phone','click');assert.equal(f.nodes['phone-form'].hidden,false);assert.equal(f.nodes['phone-code-form'].hidden,true);
});
