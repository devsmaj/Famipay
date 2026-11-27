// Local inspection backend. It never contacts the hosted API or moves money.
export function createPreviewService(storage) {
 const key='famipay-preview-profile-v1';
 let profile;
 try{profile=JSON.parse(storage.getItem(key)||'null');}catch{}
 if(!profile||typeof profile.name!=='string')profile={id:'local-preview',name:'FAMIPAY Preview',role:'customer',onboarding_complete:true};
 const capabilities={preview:true,transfers:false,wallet:false,identity:false,push:false};
 return {
  get user(){return {...profile};},capabilities,
  async request(path,options={}){
   const method=options.method||'GET';
   if(path==='/profile'&&method==='GET')return {...profile};
   if(path==='/profile'&&method==='PUT'){
    const name=options.body?.name;
    if(typeof name!=='string'||!name.trim()||name.trim().length>100)throw Error('Invalid name');
    const next={...profile,name:name.trim()};storage.setItem(key,JSON.stringify(next));profile=next;
    return {...profile};
   }
   if(path==='/financial/status'&&method==='GET')return {...capabilities};
   if(['/financial/transactions','/financial/notifications'].includes(path)&&method==='GET')return [];
   const error=Error('This service is not connected yet. No funds will be moved.');error.status=503;throw error;
  }
 };
}
if(typeof window!=='undefined'&&window.FAMIPAY_MOBILE_BUILD?.preview){
 const service=createPreviewService(window.localStorage);
 const F=window.Famina={user:service.user,ready:Promise.resolve(),config:service.capabilities,authState:'authenticated'};
 F.escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 F.api=(path,options)=>service.request(path,options);
 F.retryAuth=async()=>{F.user=service.user;};
 F.notify=(message,type='info')=>window.FaminaNotifications?.show(message,type);
 F.client={auth:{signOut:async()=>{location.replace('index.html');return{};}}};
}
