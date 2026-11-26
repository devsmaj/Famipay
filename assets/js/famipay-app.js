/* FAMIPAY's supplied reference layout; live data uses the existing authenticated API. */
(() => {
  'use strict';
  const F = window.Famina, app = document.getElementById('app');
  const services = ['Send Money','Add Money','Withdraw','Bank Transfer','Airtime','Mobile Data','Pay Bills','QR Payment','Food Delivery','Agriculture','Online Shop','Agent Services'];
  const tabs = ['Home','Wallet','Services','Orders','Me'];
  const paths = ['M22 2 15 22 11 13 2 9 22 2M22 2 11 13','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v10M7 12h10','M2 5h20v14H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6','M2 8 12 3 22 8H2M5 10v8m5-8v8m4-8v8m5-8v8M2 21h20','M6 2h12v20H6zM11 18h2','M2 8q10-8 20 0M5 12q7-6 14 0M9 16q3-3 6 0M12 20h.01','M5 3h14v19l-3-2-4 2-4-2-3 2zM8 8h8m-8 4h8','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h4v4h-7z','M4 3v6q4 8 8 0V3M8 3v19M20 3q-5 5-5 10h5v9','M12 22V10M12 15Q2 15 3 7q9-1 9 8M12 10q0-8 9-8 1 8-9 8','M4 7h16l1 15H3zM8 9V6a4 4 0 0 1 8 0v3','M3 10 12 3 21 10v11H3zM9 21v-8h6v8','M3 5h18v15H3zM3 9h18M16 14h2','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z','M3 7 12 2 21 7v10l-9 5-9-5zM3 7l9 5 9-5M12 12v10','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 22v-3a8 8 0 0 1 16 0v3'];
  const icon = i => `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[i] || paths[13]}"/></svg>`;
  const esc = F.escape;
  let lang = 'en';
  try { lang = localStorage.getItem('famipay-private-language') || 'en'; } catch (_) {}
  if (!['en','fr','ar'].includes(lang)) lang = 'en';
  const dict = window.FamipayTranslations;
  const t = s => esc(lang === 'en' ? s : dict[s]?.[lang] || s);
  const money = n => Number.isFinite(Number(n)) ? new Intl.NumberFormat(lang, {maximumFractionDigits:0}).format(Number(n)) + ' FCFA' : '—';
  let tab = 'Home', screen = '', hidden = false, data = [], addresses = [], quote = null, key = null, orderId = null, restaurant = null, revision = 0, busy = false, failed = false, review = null;
  const button = (label, action = label, cls = 'full') => `<button type="button" class="${cls}" data-open="${esc(action)}">${t(label)}</button>`;
  const tile = (s,i) => `<button type="button" class="tile" data-open="${s}"><span>${icon(i)}</span>${t(s)}</button>`;
  const panel = s => `<div class="panel">${s}</div>`;
  const unavailable = () => panel(t('This service is not connected yet. No funds will be moved.'));
  const field = (label,id,type='text',value='') => `<label for="${id}">${t(label)}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}" required maxlength="${id==='name'?100:200}" ${type==='number'?'min="1" step="1" max="2147483647"':''}>`;
  const amount = item => item.total ?? item.total_amount ?? 0;
  function body() {
    if (failed) return panel(t('Unable to load. Please try again.')) + '<button class="full" data-action="retry">'+t('Try again')+'</button>';
    if (!screen) {
      if (tab === 'Home') return `<div class="row"><h3>${t('Quick Services')}</h3><button class="link" data-tab="Services">${t('View all →')}</button></div><div class="grid">${services.slice(0,8).map(tile).join('')}</div><hr class="divider"><h3 class="express-title">FA-MINNA Express</h3><div class="express">${services.slice(8,11).map((s,i)=>`<button data-open="${s}">${icon(i+8)}${t(s)}</button>`).join('')}</div>${panel('<b class="green">✓ '+t('Clear and secure by design')+'</b><br><small>'+t('Review recipient, amount and fees before every payment.')+'</small>')}`;
      if (tab === 'Services') return `<h3>${t('All Services')}</h3><div class="grid all-services">${services.map(tile).join('')}</div>`;
      if (tab === 'Wallet') return `<h3>${t('Wallet Activity')}</h3>${unavailable()}${button('Withdraw')}`;
      if (tab === 'Orders') return `<h3>${t('My Orders')}</h3>` + (data.length ? data.map(o=>panel(`<b>${esc(o.id)}</b><br>${t(o.status)} · ${money(amount(o))}<button class="full" data-order="${esc(o.id)}">${t('Track Order')}</button>`)).join('') : panel(t('No orders yet.')) + button('Food Delivery'));
      if (tab === 'Me') return `<h3>${esc(F.user.name || F.user.email || 'FAMIPAY')}</h3><p>${esc(F.user.phone || '')}</p>` + ['Personal Information','Identity Verification','Security & PIN','Language','Help & Support'].map(s=>`<button class="line account-link" data-open="${s}">${t(s)} <span aria-hidden="true">›</span></button>`).join('') + '<button class="full" data-action="logout">'+t('Sign out')+'</button>';
    }
    if (screen === 'Food Delivery') return `<h3>${t('Explore Food Delivery')}</h3>` + (data.length ? data.map(r=>panel(`<b>${esc(r.name)}</b><p>${esc(r.description || '')}</p><button class="full" data-restaurant="${esc(r.id)}">${t('View menu')}</button>`)).join('') : panel(t('No restaurants available.')));
    if (screen === 'Restaurant Menu') return `<h3>${t('Restaurant Menu')}</h3>` + (data.length ? data.map(g=>panel(`<div class="row"><div><b>${esc(g.name)}</b><br>${money(g.price)}</div><button data-add="${esc(g.id)}" ${!g.available?'disabled':''}>${t('+ Add')}</button></div>`)).join('') : panel(t('No products available.'))) + button('View cart','Cart');
    if (screen === 'Cart') return `<h3>${t('Cart')}</h3>` + (data.length ? data.map(g=>`<div class="line row"><div>${esc(g.name)} × ${esc(g.quantity)}<br>${money(g.price * g.quantity)}</div><button data-remove="${esc(g.id)}">${t('Remove')}</button></div>`).join('') + panel(t('Subtotal')+': '+money(data.reduce((s,g)=>s+g.price*g.quantity,0))) + button('Continue →','Checkout') : panel(t('Your cart is empty.')));
    if (screen === 'Checkout') return `<h3>${t('Delivery address')}</h3>` + (addresses.length ? `<form data-form="quote"><label for="address">${t('Delivery address')}</label><select id="address" name="address" class="address-select" required>${addresses.map(a=>`<option value="${esc(a.id)}">${esc(a.label)} · ${esc(a.address)}</option>`).join('')}</select>${panel(t('Payment method')+': '+t('Cash on delivery'))}<button class="full" type="submit">${t('Review order')}</button></form>` : panel(t('No saved addresses. Add a delivery address.'))) + button('Add address','Add address');
    if (screen === 'Add address') return `<form data-form="address">${field('Label','label')}${field('Delivery address','address')}${field('Phone (+235XXXXXXXX)','phone','tel')}${field('Latitude','latitude','text')}${field('Longitude','longitude','text')}<button type="button" class="full" data-action="location">${t('Use my location')}</button><button class="full" type="submit">${t('Save')}</button></form>`;
    if (screen === 'Review Order') return `<h3>${t('Review order')}</h3>${panel(t('Subtotal')+': '+money(quote.subtotal)+'<br>'+t('Delivery fee')+': '+money(quote.delivery_fee)+'<br>'+t('Total')+': '+money(quote.total)+'<br>'+t('Cash on delivery'))}<button class="full" data-action="checkout">${t('Confirm order')}</button>`;
    if (screen === 'Track Order') { const o=data; return `<h3>${t('Track Order')}</h3>${panel(esc(o.id)+'<br><b>'+t(o.status)+'</b><br>'+money(amount(o)))}${(o.order_events||[]).map(e=>`<div class="line">${t(e.status || e.to_status || e.event_type || '')}<br><small>${esc(new Date(e.created_at).toLocaleString(lang))}</small></div>`).join('')}${o.delivery_code?panel(t('Delivery code')+': '+esc(typeof o.delivery_code==='string'?o.delivery_code:JSON.stringify(o.delivery_code))):''}<button class="full" data-action="retry">${t('Refresh')}</button>`; }
    if (screen === 'Notifications') return `<h3>${t('Notifications')}</h3>` + (data.length ? data.map(n=>panel(`<b>${esc(n.title || '')}</b><p>${esc(n.message || n.body || '')}</p>`)).join('') : panel(t('No notifications.')));
    if (screen === 'Personal Information') return `<form data-form="profile">${field('Name','name','text',F.user.name||'')}<button class="full" type="submit">${t('Save')}</button></form>`;
    if (screen === 'Language') return panel(t('Choose your language using the selector above.'));
    if (screen === 'Help & Support') return panel('<a href="contact.html">'+t('Contact support')+'</a>');
    if (screen === 'Security & PIN') return panel(t('Your account is secured by Supabase authentication.')) + '<button class="full" data-action="logout">'+t('Sign out')+'</button>';
    if (screen === 'Review') return `<h3>${t('Review transaction')}</h3>${panel(t(review.name)+'<br>'+t('Recipient')+': '+esc(review.recipient)+'<br>'+t('Amount (FCFA)')+': '+money(review.amount))}${unavailable()}<button class="full" disabled>${t('Confirm transaction')}</button>`;
    if (services.slice(0,7).includes(screen)) return `<h3>${t(screen)}</h3><form data-form="payment">${field('Recipient or provider','recipient')}${field('Amount (FCFA)','amount','number','5000')}${panel(t('Service fee: Not configured'))}<button class="full" type="submit">${t('Continue →')}</button></form>`;
    return `<h3>${t(screen)}</h3>${unavailable()}`;
  }
  function render() {
    document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    const balance = !screen && ['Home','Wallet'].includes(tab);
    app.innerHTML=`<header><div class="row"><div class="row">${screen?'<button class="back" data-action="back" aria-label="'+t('Back')+'">←</button>':'<div class="logo">'+icon(12)+'</div>'}<div><b>${t(screen||'FAMIPAY')}</b><br><small>${t('Simple payments. Everyday life.')}</small></div></div><select id="language" aria-label="Language / Langue / اللغة">${['fr','ar','en'].map(l=>`<option value="${l}" ${l===lang?'selected':''}>${l.toUpperCase()}</option>`).join('')}</select><button class="back" data-open="Notifications" aria-label="${t('Notifications')}">♧</button></div>${balance?`<div class="balance-label row"><button class="back balance-toggle" data-action="hide" aria-label="${t('Hide balance')}">${t('Available Balance')} ◉</button><small>${t('Wallet not connected')}</small></div><div class="balance">${hidden?'••••••':'—'} <small class="currency">FCFA</small></div><div class="row">${button('Add Money','Add Money','white')}${button('↗ Transfer','Send Money','outline')}</div>`:''}</header><main id="fp-content" aria-busy="${busy}">${busy?panel(t('Loading…')):body()}<p class="error" role="alert" id="err"></p><p role="status" id="notice"></p></main>${!screen?`<nav aria-label="${t('Main navigation')}">${tabs.map((s,i)=>`<button class="${tab===s?'active':''}" data-tab="${s}" ${tab===s?'aria-current="page"':''}>${icon(i+11)}${t(s)}</button>`).join('')}</nav>`:''}<div class="foot">${t('Financial services are not connected.')}</div>`;
    document.title=(screen||tab)+' · FAMIPAY';
    app.querySelector('#language').onchange=e=>{ lang=e.target.value;try{localStorage.setItem('famipay-private-language',lang);}catch(_){}render(); };
  }
  async function load() {
    const current=++revision; busy=true; failed=false; render();
    try {
      let result=[];
      if (!screen && tab==='Orders') result=await F.api('/orders');
      if (screen==='Food Delivery') result=await F.api('/restaurants');
      if (screen==='Restaurant Menu') result=(await F.api('/menu')).filter(item=>item.restaurant_id===restaurant);
      if (screen==='Cart') result=await F.api('/cart');
      if (screen==='Checkout') addresses=await F.api('/addresses');
      if (screen==='Notifications') result=await F.api('/notifications');
      if (screen==='Track Order') result=await F.api('/orders/'+encodeURIComponent(orderId));
      if (current!==revision) return;
      data=result;
    } catch (_) { if(current===revision)failed=true; }
    finally { if(current===revision){busy=false;render();} }
  }
  const aliases={'home':'Home','wallet':'Wallet','services':'Services','my-orders':'Orders','orders':'Orders','my-profile':'Me','me':'Me','express-home':'Food Delivery','restaurants':'Food Delivery','food-cart':'Cart','food-checkout':'Checkout','notifications':'Notifications','settings':'Language','help-center':'Help & Support','transaction-history':'Wallet'};
  function route() {
    let value; try{value=decodeURIComponent(location.hash.slice(1));}catch(_){value='Home';}
    value=aliases[value]||value||'Home';
    const named=services.find(s=>s.toLowerCase().replaceAll(' ','-')===value);
    value=named||value;
    if(tabs.includes(value)){tab=value;screen='';}else if([...services,'Restaurant Menu','Cart','Checkout','Add address','Review Order','Track Order','Notifications','Personal Information','Identity Verification','Security & PIN','Language','Help & Support','Review'].includes(value)){screen=value;}else{tab='Home';screen='';}
    if(screen==='Review'&&!review||screen==='Review Order'&&!quote||screen==='Track Order'&&!orderId||screen==='Restaurant Menu'&&!restaurant){screen='';tab='Home';}
    load();
  }
  function open(value){ if(location.hash==='#'+encodeURIComponent(value))route();else location.hash=encodeURIComponent(value); }
  async function action(element, fn) {
    if (element.disabled) return; element.disabled=true;
    try { await fn(); } catch (_) { const error=app.querySelector('#err');if(error)error.textContent=lang==='en'?'Unable to complete. Please try again.':dict['Unable to complete. Please try again.'][lang]; }
    finally{element.disabled=false;}
  }
  app.addEventListener('click',e=>{
    const el=e.target.closest('button');if(!el)return;
    const d=el.dataset;
    if(d.open){open(d.open);return;} if(d.tab){open(d.tab);return;}
    if(d.restaurant){restaurant=d.restaurant;open('Restaurant Menu');return;}
    if(d.order){orderId=d.order;open('Track Order');return;}
    action(el,async()=>{
      if(d.add){await F.api('/cart',{method:'POST',body:{itemId:d.add,quantity:1}});app.querySelector('#notice').textContent=lang==='en'?'Item added to cart.':dict['Item added to cart.'][lang];}
      if(d.remove){await F.api('/cart/'+encodeURIComponent(d.remove),{method:'DELETE'});await load();}
      if(d.action==='hide'){hidden=!hidden;render();}
      if(d.action==='retry')await load();
      if(d.action==='back')open(screen==='Review'?review.name:screen==='Restaurant Menu'?'Food Delivery':screen==='Review Order'?'Checkout':screen==='Add address'?'Checkout':'Home');
      if(d.action==='logout'){const result=await F.client.auth.signOut();if(result.error)throw result.error;location.replace('login.html');}
      if(d.action==='location')await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(p=>{app.querySelector('#latitude').value=p.coords.latitude;app.querySelector('#longitude').value=p.coords.longitude;resolve();},reject,{timeout:15000}));
      if(d.action==='checkout'){
        const order=await F.api('/orders',{method:'POST',headers:{'Idempotency-Key':key},body:{quoteId:quote.id,paymentMethod:'cash_on_delivery'}});
        orderId=order.id; quote=null; key=null; open('Track Order');
      }
    });
  });
  app.addEventListener('submit',e=>{
    e.preventDefault();const form=e.target;if(!form.reportValidity())return;
    const values=Object.fromEntries(new FormData(form));
    action(form.querySelector('[type="submit"]'),async()=>{
      if(form.dataset.form==='payment'){
        const n=Number(values.amount);if(!values.recipient.trim()||!Number.isSafeInteger(n)||n<1)throw Error('Invalid');
        review={name:screen,recipient:values.recipient.trim(),amount:n};open('Review');
      }
      if(form.dataset.form==='profile'){
        if(!values.name.trim())throw Error('Invalid');
        await F.api('/profile',{method:'PUT',body:{name:values.name.trim()}});await F.retryAuth();open('Me');
      }
      if(form.dataset.form==='address'){
        if(!/^\+235\d{8}$/.test(values.phone)||!values.latitude.trim()||!values.longitude.trim())throw Error('Invalid');
        const latitude=Number(values.latitude),longitude=Number(values.longitude);
        if(!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude)||Math.abs(longitude)>180)throw Error('Invalid');
        await F.api('/addresses',{method:'POST',body:{...values,latitude,longitude}});open('Checkout');
      }
      if(form.dataset.form==='quote'){
        quote=await F.api('/quotes',{method:'POST',body:{addressId:values.address}});key=crypto.randomUUID();open('Review Order');
      }
    });
  });
  window.addEventListener('hashchange',route);
  window.addEventListener('famina-signed-out',()=>{revision++;app.replaceChildren();location.replace('login.html');});
  route();
})();
