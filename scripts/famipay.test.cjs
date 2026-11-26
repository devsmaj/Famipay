// Isolated API fixtures: these tests never create production accounts or orders.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/famipay-app.js','utf8');
const translations = fs.readFileSync('assets/js/famipay-translations.js','utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture(overrides={}) {
  const listeners={},events={},calls=[],nodes={};
  const app={innerHTML:'',querySelector:s=>nodes[s] ||= {},addEventListener:(n,fn)=>events[n]=fn,replaceChildren(){this.innerHTML='';}};
  const F={escape:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),user:{id:'customer',name:'Customer',role:'customer'},api:async(path,options)=>{calls.push({path,options});if(path in overrides){const result=overrides[path];if(result instanceof Error)throw result;return result;}return [];},retryAuth:async()=>{},client:{auth:{signOut:async()=>({})}}};
  let hash='';
  const location={get hash(){return hash;},set hash(v){hash=v.startsWith('#')?v:'#'+v;listeners.hashchange?.();},replace(){}};
  const context={window:{Famina:F,addEventListener:(n,fn)=>listeners[n]=fn},document:{getElementById:()=>app,documentElement:{}},location,localStorage:{getItem:key=>key==='language'?'en':null,setItem(){}},navigator:{},FormData:class{constructor(form){return Object.entries(form.values);}},crypto:{randomUUID:()=> 'test-idempotency-key'},Intl,Number,Object,Date,encodeURIComponent,decodeURIComponent};
  vm.createContext(context);vm.runInContext(translations,context);vm.runInContext(source,context);
  const click=async dataset=>{events.click({target:{closest:()=>({dataset,disabled:false})}});await flush();await flush();};
  const submit=async(type,values)=>{events.submit({preventDefault(){},target:{dataset:{form:type},values,reportValidity:()=>true,querySelector:()=>({disabled:false})}});await flush();await flush();};
  return {app,F,calls,context,nodes,click,submit,go:async route=>{location.hash='#'+encodeURIComponent(route);await flush();await flush();}};
}
test('reference navigation, financial review, and no invented payment requests',async()=>{
  const f=fixture();await flush();
  assert.match(f.app.innerHTML,/Quick Services/);assert.match(f.app.innerHTML,/Wallet not connected/);assert.doesNotMatch(f.app.innerHTML,/125,000/);
  for(const screen of ['Services','Wallet','Me','Send Money','Add Money','Withdraw','Bank Transfer','Airtime','Mobile Data','Pay Bills','QR Payment','Agriculture','Online Shop','Agent Services','Identity Verification','Security & PIN','Language','Help & Support']){await f.go(screen);assert.match(f.app.innerHTML,/<header>/);assert.doesNotMatch(f.app.innerHTML,/undefined/);}
  await f.go('Send Money');await f.submit('payment',{recipient:'<img src=x onerror=alert(1)>',amount:'5000'});
  assert.match(f.app.innerHTML,/Review transaction/);assert.match(f.app.innerHTML,/&lt;img/);assert.match(f.app.innerHTML,/disabled>Confirm transaction/);
  assert.equal(f.calls.length,0);
});
test('menu filtering, backend cart, server quote and idempotent checkout',async()=>{
  const f=fixture({'/restaurants':[{id:'restaurant',name:'Restaurant'}],'/menu':[{id:'item',restaurant_id:'restaurant',name:'Food',price:1000,available:true},{id:'other',restaurant_id:'other',name:'Wrong restaurant',price:2,available:true}],'/cart':[{id:'item',name:'Food',quantity:2,price:1000}],'/addresses':[{id:'address',label:'Home',address:'Test address'}],'/quotes':{id:'quote',subtotal:2000,delivery_fee:500,total:2500},'/orders':{id:'order'},'/orders/order':{id:'order',status:'pending',total:2500,order_events:[]}});
  await flush();await f.go('Food Delivery');await f.click({restaurant:'restaurant'});
  assert.match(f.app.innerHTML,/Food/);assert.doesNotMatch(f.app.innerHTML,/Wrong restaurant/);
  await f.click({add:'item'});assert.equal(f.calls.at(-1).options.body.itemId,'item');
  await f.go('Cart');assert.match(f.app.innerHTML,/2,000 FCFA/);
  await f.go('Checkout');await f.submit('quote',{address:'address'});assert.match(f.app.innerHTML,/2,500 FCFA/);
  await f.click({action:'checkout'});
  const checkout=f.calls.find(c=>c.path==='/orders'&&c.options?.method==='POST');
  assert.equal(checkout.options.body.quoteId,'quote');assert.equal(checkout.options.body.paymentMethod,'cash_on_delivery');assert.equal(checkout.options.headers['Idempotency-Key'],'test-idempotency-key');assert.match(f.app.innerHTML,/Track Order/);
});
test('API failures have recovery controls, all locales update document direction',async()=>{
  const f=fixture({'/orders':Error('offline')});await flush();await f.go('Orders');assert.match(f.app.innerHTML,/Try again/);
  for(const language of ['fr','ar','en']){f.nodes['#language'].onchange({target:{value:language}});assert.equal(f.context.document.documentElement.lang,language);assert.equal(f.context.document.documentElement.dir,language==='ar'?'rtl':'ltr');}
});
test('profile and address validation make only expected writes',async()=>{
  const f=fixture();await flush();await f.go('Personal Information');await f.submit('profile',{name:'Updated Customer'});
  assert.equal(f.calls.find(c=>c.path==='/profile').options.body.name,'Updated Customer');
  await f.go('Add address');await f.submit('address',{label:'Home',address:'Test',phone:'invalid',latitude:'0',longitude:'0'});
  assert.equal(f.calls.filter(c=>c.path==='/addresses'&&c.options).length,0);
});
