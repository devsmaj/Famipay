const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const model = require('../assets/js/restaurant-directory-model.js');
const context = { window:{} };
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/abeche-restaurants.js'),'utf8'),context);
const directory = JSON.parse(JSON.stringify(context.window.FAMINA_ABECHE_RESTAURANTS));

test('sourced entries have unique IDs and source links, without fabricated business metrics', () => {
  assert.equal(directory.length,9);
  assert.equal(new Set(directory.map(row=>row.id)).size,directory.length);
  for (const row of directory) {
    assert.equal(new URL(row.source).protocol,'https:');
    for (const field of ['rating','delivery_fee','delivery_minutes','latitude','longitude','available']) assert.equal(row[field],undefined);
  }
});

test('search matches accents and aliases', () => {
  assert.equal(model.select(directory,{query:'galape'}).rows[0].name,'Restaurant Galapé');
  assert.equal(model.select(directory,{query:'Rose des Sables'}).rows[0].id,'directory-rose');
  assert.equal(model.select(directory,{query:'وردة الرمال'}).rows[0].id,'directory-rose');
});

test('public listings do not become orderable merely by existing in the directory', () => {
  const rows = model.merge(directory,[]);
  assert.equal(model.select(rows,{orderable:true}).total,0);
  assert.ok(rows.every(row=>row.partner===false));
});

test('approved local partners merge with matching listings without duplicates', () => {
  const rows = model.merge(directory,[
    {id:'live-galape',name:'Galape',approved:true,available:true,latitude:13.829,longitude:20.832},
    {id:'unapproved',name:'Hidden',approved:false,available:true,latitude:13.829,longitude:20.832},
    {id:'elsewhere',name:'Other city',approved:true,available:true,latitude:12.1,longitude:15.0}
  ]);
  assert.equal(rows.length,9);
  const orderable = model.select(rows,{orderable:true});
  assert.equal(orderable.total,1);
  assert.equal(orderable.rows[0].id,'live-galape');
  assert.ok(orderable.rows[0].source);
});

test('cuisine filters combine with search and reset pagination to valid bounds', () => {
  assert.equal(model.select(directory,{cuisines:['French']}).total,1);
  assert.equal(model.select(directory,{query:'rose',cuisines:['French']}).total,1);
  assert.equal(model.select(directory,{query:'rose',cuisines:['Fast food']}).total,0);
  const second = model.select(directory,{page:2});
  assert.equal(second.pages,2);
  assert.equal(second.rows.length,4);
  assert.equal(model.select(directory,{page:999}).page,2);
  assert.equal(model.select(directory,{query:'no match',page:2}).page,1);
});

test('nearest sort keeps unknown coordinates last and reports straight-line distances', () => {
  const point = {latitude:13.829,longitude:20.832};
  const rows = [{name:'Unknown'},{name:'Far',latitude:13.9,longitude:20.9},{name:'Near',...point}];
  assert.deepEqual(model.select(rows,{sort:'distance',point}).rows.map(row=>row.name),['Near','Far','Unknown']);
  assert.equal(model.distance(point,point),0);
  assert.equal(model.distance(point,{}),null);
  assert.equal(model.validPoint({latitude:100,longitude:20}),false);
});

test('delivery confirmation preserves the selected point and opens the directory', () => {
  const ids=['delivery-search-form','delivery-search','delivery-search-error','delivery-map-panel','delivery-map-status','delivery-use-location','delivery-confirm'];
  const nodes=Object.fromEntries(ids.map(id=>[id,{hidden:true,value:'',listeners:{},addEventListener(k,f){this.listeners[k]=f},setAttribute(){},removeAttribute(){},focus(){}}]));
  let saved, destination;
  const handlers={};
  const map={setView(){return this},on(k,f){handlers[k]=f},invalidateSize(){}};
  const L={map:()=>map,tileLayer:()=>({addTo(){return this},on(){}}),marker:()=>({addTo(){return this},on(){},setLatLng(){}})};
  const app={document:{getElementById:id=>nodes[id]},window:{L},L,requestAnimationFrame:f=>f(),navigator:{},sessionStorage:{setItem(k,v){saved=JSON.parse(v)}},location:{assign(url){destination=url}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/delivery-search.js'),'utf8'),app);
  nodes['delivery-search'].value='Grand marché, Abéché';
  nodes['delivery-search-form'].listeners.submit({preventDefault(){}});
  handlers.click({latlng:{lat:13.829,lng:20.832}});
  nodes['delivery-confirm'].listeners.click();
  assert.equal(destination,'restaurant.html');
  assert.equal(saved.address,'Grand marché, Abéché');
  assert.equal(saved.latitude,13.829);
});
