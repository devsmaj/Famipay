const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
async function service(){const source=fs.readFileSync(path.resolve(__dirname,'../src/preview-service.js'),'utf8');const {createPreviewService}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));const map=new Map();return {createPreviewService,storage:{getItem:key=>map.get(key),setItem:(key,value)=>map.set(key,value)}};}
test('preview profile changes persist locally and cannot overwrite account identity',async()=>{
 const {createPreviewService,storage}=await service(),api=createPreviewService(storage);
 await api.request('/profile',{method:'PUT',body:{name:'Local reviewer',id:'another-account',role:'admin'}});
 assert.equal(createPreviewService(storage).user.name,'Local reviewer');assert.equal(api.user.id,'local-preview');assert.equal(api.user.role,'customer');
 await assert.rejects(api.request('/profile',{method:'PUT',body:{name:' '}}));
});
test('preview financial backend has empty history and refuses all money movement',async()=>{
 const {createPreviewService,storage}=await service(),api=createPreviewService(storage);
 assert.deepEqual(await api.request('/financial/transactions'),[]);assert.deepEqual(await api.request('/financial/notifications'),[]);
 assert.equal((await api.request('/financial/status')).preview,true);
 for(const path of ['/payments','/transfers','/wallet','/push/devices'])await assert.rejects(api.request(path,{method:'POST',body:{amount:100}}),{status:503});
});
