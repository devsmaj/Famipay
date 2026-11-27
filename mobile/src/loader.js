(function(){
 let layer,nextId=0,shownAt=0,hideTimer,cleanupSlide;
 const pending=new Map();
 function ensure(){
  if(layer)return layer;
  layer=document.createElement('div');layer.id='fp-loader';layer.hidden=true;layer.setAttribute('role','status');layer.setAttribute('aria-live','polite');
  const disc=document.createElement('div');disc.className='fp-loader-disc';
  const logo=document.createElement('img');logo.src='assets/branding/famipay-mark.svg';logo.alt='FAMIPAY';logo.draggable=false;
  const label=document.createElement('span');label.className='fp-loader-label';
  disc.append(logo);layer.append(disc,label);document.body.append(layer);return layer;
 }
 function refresh(){
  const node=ensure(),startup=[...pending.values()].some(value=>value.startup);
  node.classList.toggle('fp-loader-startup',startup);
  const language=(document.documentElement.lang||'fr').split('-')[0];
  node.querySelector('.fp-loader-label').textContent={en:'Loading',fr:'Chargement',ar:'جارٍ التحميل'}[language]||'Loading';
 }
 function begin({startup=false}={}){
  clearTimeout(hideTimer);const token=++nextId;pending.set(token,{startup});const node=ensure();
  if(node.hidden)shownAt=performance.now();node.hidden=false;refresh();return token;
 }
 function end(token){
  if(!pending.delete(token))return;if(pending.size){refresh();return;}
  const delay=Math.max(0,240-(performance.now()-shownAt));
  hideTimer=setTimeout(()=>{if(!pending.size)ensure().hidden=true;},delay);
 }
 function slide(render,{back=false}={}){
  cleanupSlide?.();const app=document.getElementById('app'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!app||reduced){render();return;}
  const previous=app.cloneNode(true),rect=app.getBoundingClientRect();previous.removeAttribute('id');previous.className='fp-route-previous';previous.setAttribute('aria-hidden','true');previous.setAttribute('inert','');
  for(const node of previous.querySelectorAll('[id]'))node.removeAttribute('id');
  Object.assign(previous.style,{top:rect.top+'px',left:rect.left+'px',width:rect.width+'px',height:rect.height+'px'});
  document.body.append(previous);render();app.classList.add('fp-route-entering');
  const sign=(document.documentElement.dir==='rtl'?-1:1)*(back?-1:1);
  const movement=app.animate([{transform:`translateX(${sign*100}%)`},{transform:'translateX(0)'}],{duration:240,easing:'cubic-bezier(.2,.75,.25,1)'});
  const cleanup=()=>{movement.cancel();previous.remove();app.classList.remove('fp-route-entering');cleanupSlide=null;};
  cleanupSlide=cleanup;
  return movement.finished.catch(()=>{}).finally(()=>{if(cleanupSlide===cleanup)cleanup();});
 }
 window.FamipayLoading={begin,end,slide};
})();
