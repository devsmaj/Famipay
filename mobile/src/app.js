(function(){
 const F=window.Famina,app=document.getElementById('app');
 const tabs=['Home','Wallet','Services','Transactions','Me'];
 const services=['Send Money','Receive Money','Mobile Money','Add Money','Withdraw','Bank Transfer','Airtime','Mobile Data','Pay Bills','QR Payment','Merchant Payments','Agent Services'];
 const settings=['Personal Information','Identity Verification','Security & PIN','Language','Help & Support','Notifications'];
 let language=(window.FaminaSession.getPreference('language')||'fr').split('-')[0],screen='Home',hidden=false,review,backward=false;
 if(!['en','fr','ar'].includes(language))language='fr';
 const esc=F.escape,t=value=>esc(language==='en'?value:window.FamipayTranslations[value]?.[language]||value);
 const panel=value=>`<div class="panel">${value}</div>`;
 const button=(value,cls='full')=>`<button type="button" class="${cls}" data-open="${esc(value)}">${t(value)}</button>`;
 const unavailable=()=>panel(t('This service is not connected yet. No funds will be moved.'));
 const field=(label,id,type='text',value='')=>`<label for="${id}">${t(label)}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}" required maxlength="100" ${type==='number'?'min="1" step="1" max="2147483647"':''}>`;
 const glyphs=['↗','↙','⇄','+','−','▥','▯','◉','≡','▦','◇','⌂'];
 const tiles=()=>`<div class="grid home-grid">${services.map((name,i)=>`<button class="tile" data-open="${name}"><span aria-hidden="true">${glyphs[i]}</span>${t(name)}</button>`).join('')}</div>`;
 function body(){
  if(screen==='Home')return `<h3>${t('Quick Services')}</h3>${tiles()}`;
  if(screen==='Services')return `<h3>${t('All Services')}</h3>${tiles()}`;
  if(screen==='Wallet')return `<h3>${t('Wallet Activity')}</h3>${unavailable()}${button('Add Money')}${button('Withdraw')}`;
  if(screen==='Transactions')return `<h3>${t('Transactions')}</h3>${panel(t('Transaction history is not connected yet.'))}`;
  if(screen==='Notifications')return `<h3>${t('Notifications')}</h3>${panel(t('Financial notifications are not connected yet.'))}`;
  if(screen==='Me')return `<h3>${esc(F.user.name||F.user.email||'FAMIPAY')}</h3>${F.user.phone?panel(esc(F.user.phone)):''}${settings.map(name=>button(name,'line account-link')).join('')}<button class="full" data-action="logout">${t('Sign out')}</button>`;
  if(screen==='Personal Information')return `<form data-form="profile">${field('Name','name','text',F.user.name||'')}<button class="full" type="submit">${t('Save')}</button></form>`;
  if(screen==='Language')return panel(t('Choose your language using the selector above.'));
  if(screen==='Security & PIN')return panel(t('Your account uses email or phone authentication.'))+button('Identity Verification');
  if(screen==='Help & Support')return panel(t('Support contact details are not configured yet.'))+`<a href="legal.html#terms">${t('Terms')}</a> · <a href="legal.html#privacy">${t('Privacy')}</a>`;
  if(screen==='Review'&&review)return `<h3>${t('Review transaction')}</h3>${panel(`${t(review.service)}<br>${t('Recipient')}: ${esc(review.recipient)}<br>${t('Amount (FCFA)')}: <bdi>${new Intl.NumberFormat(language).format(review.amount)} FCFA</bdi>`)}${unavailable()}<button class="full" disabled>${t('Confirm transaction')}</button>`;
  if(services.includes(screen))return `<h3>${t(screen)}</h3>${unavailable()}<form data-form="payment">${field('Recipient or provider','recipient')}${field('Amount (FCFA)','amount','number')}${panel(t('Service fee: Not configured'))}<button class="full" type="submit">${t('Continue →')}</button></form>`;
  return `<h3>${t(screen)}</h3>${unavailable()}`;
 }
 function render(){
  document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';document.title=(screen||'Home')+' · FAMIPAY';
  if(!F.user){app.innerHTML=`<header><img class="mobile-logo" src="assets/branding/famipay-logo.svg" alt="FAMIPAY"></header><main id="fp-content">${panel(t('Please sign in to access FAMIPAY.'))}<a class="auth-link" href="login.html">${t('Login / Sign up')}</a></main>`;return;}
  const root=tabs.includes(screen),balance=['Home','Wallet'].includes(screen);
  app.innerHTML=`<header class="${screen==='Home'?'home-app-header':''}"><div class="row">${root?'<img class="mobile-logo" src="assets/branding/famipay-mark.svg" alt="FAMIPAY">':`<button class="back" data-action="back" aria-label="${t('Back')}">←</button>`}<b>${screen==='Home'?esc(F.user.name||'FAMIPAY'):t(screen)}</b><select id="language" aria-label="Language / Langue / اللغة">${['en','fr','ar'].map(value=>`<option value="${value}" ${value===language?'selected':''}>${value.toUpperCase()}</option>`).join('')}</select><button class="back" data-open="Notifications" aria-label="${t('Notifications')}">♧</button></div>${balance?`<div class="home-balance-card"><button class="back" data-action="hide">${t('Available Balance')}</button><div class="balance">${hidden?'••••••':'—'} <small>FCFA</small></div><small>${t('Wallet not connected')}</small>${button('Add Money','white')}</div>`:''}</header><main id="fp-content">${body()}<p id="err" class="error" role="alert"></p><p id="notice" role="status"></p></main>${root?`<nav aria-label="${t('Main navigation')}">${tabs.map((value,i)=>`<button data-open="${value}" class="${value===screen?'active':''}" ${value===screen?'aria-current="page"':''}><span aria-hidden="true">${['⌂','▣','▦','⇄','○'][i]}</span>${t(value)}</button>`).join('')}</nav>`:''}<div class="foot">${t('Financial services are not connected.')}</div>`;
  app.querySelector('#language').onchange=event=>{language=event.target.value;window.FaminaSession.setPreference('language',language==='en'?'en':language+'-TD');render();};
 }
 function open(value){location.hash=encodeURIComponent(value);}
 function route(initial=false){let value;try{value=decodeURIComponent(location.hash.slice(1));}catch{value='Home';}screen=[...tabs,...services,...settings,'Review'].includes(value)?value:'Home';if(screen==='Review'&&!review)screen='Home';const loader=window.FamipayLoading;if(initial===true){render();}else{const loading=loader?.begin(),animation=loader?loader.slide(render,{back:backward}):render();backward=false;Promise.resolve(animation).finally(()=>loader?.end(loading));}window.scrollTo(0,0);}
 app.addEventListener('click',async event=>{
  const el=event.target.closest('button');if(!el)return;
  if(el.dataset.open)return open(el.dataset.open);
  if(el.dataset.action==='back'){backward=true;return open(screen==='Review'?review.service:'Home');}
  if(el.dataset.action==='hide'){hidden=!hidden;render();return;}
  if(el.dataset.action==='logout'){el.disabled=true;try{const {error}=await F.client.auth.signOut();if(error)throw error;location.replace('login.html');}catch{el.disabled=false;app.querySelector('#err').textContent=t('Unable to complete. Please try again.');}}
 });
 app.addEventListener('submit',async event=>{
  event.preventDefault();const form=event.target;if(!form.reportValidity())return;
  const values=Object.fromEntries(new FormData(form)),submit=event.submitter;submit.disabled=true;
  const loading=window.FamipayLoading?.begin();
  try{
   if(form.dataset.form==='payment'){
    const amount=Number(values.amount);if(!values.recipient.trim()||!Number.isSafeInteger(amount)||amount<1)throw Error('Invalid');
    review={service:screen,recipient:values.recipient.trim(),amount};open('Review');
   }else{
    if(!values.name.trim())throw Error('Invalid');await F.api('/profile',{method:'PUT',body:{name:values.name.trim()}});await F.retryAuth();open('Me');
   }
  }catch{app.querySelector('#err').textContent=t('Unable to complete. Please try again.');}finally{submit.disabled=false;window.FamipayLoading?.end(loading);}
 });
 window.addEventListener('hashchange',route);window.addEventListener('famina-signed-out',()=>location.replace('login.html'));
 app.innerHTML='<main id="fp-content" role="status">'+t('Checking your session…')+'</main>';
 const startup=window.FamipayLoading?.begin({startup:true});
 F.ready.then(()=>{route(true);requestAnimationFrame(()=>requestAnimationFrame(()=>window.FamipayLoading?.end(startup)));}).catch(()=>window.FamipayLoading?.end(startup));
})();
