import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { PushNotifications as Push } from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';

const messages = {
  notifications:['Enable notifications','Activer les notifications','تفعيل الإشعارات'],
  updates:['Check for updates','Rechercher une mise à jour','البحث عن تحديثات'],
  offline:['You are offline. Reconnect to load account information.','Vous êtes hors connexion. Reconnectez-vous pour charger votre compte.','أنت غير متصل. اتصل بالإنترنت لتحميل معلومات الحساب.'],
  enabled:['Notifications enabled.','Notifications activées.','تم تفعيل الإشعارات.'],
  denied:['Allow notifications in Android Settings to receive updates.','Autorisez les notifications dans les paramètres Android.','اسمح بالإشعارات في إعدادات أندرويد لتلقي التحديثات.'],
  unavailable:['Push notifications are not configured for this build.','Les notifications push ne sont pas configurées pour cette version.','لم يتم إعداد الإشعارات الفورية لهذا الإصدار.'],
  error:['Unable to complete. Please try again.','Impossible de terminer. Réessayez.','تعذر الإكمال. يرجى المحاولة مرة أخرى.'],
  signin:['Please sign in first.','Veuillez vous connecter.','يرجى تسجيل الدخول أولاً.']
};
const lang = () => (document.documentElement.lang || 'fr').split('-')[0];
const t = key => messages[key][{en:0,fr:1,ar:2}[lang()] ?? 1];
const native = Capacitor.isNativePlatform();
let status, pushReady, registration;
const notice = key => { if (status) status.textContent=t(key); };
async function bindToken(token) {
  const F=window.Famina;
  if (!F?.user) return;
  await F.api('/push/devices',{method:'POST',body:{token,language:lang(),platform:'android'}});
  notice('enabled');
}
async function setupPush() {
  if (pushReady) return pushReady;
  pushReady=(async()=>{
    await Push.addListener('registration', result => {
      registration=result.value;
      bindToken(registration).catch(()=>notice('error'));
    });
    await Push.addListener('registrationError',()=>notice('error'));
    // Avoid rendering lock-screen notification content as trusted HTML.
    await Push.addListener('pushNotificationReceived',()=>window.Famina?.notify(t('enabled')));
    await Push.addListener('pushNotificationActionPerformed',()=>{
      location.href='famipay-app.html#Notifications';
    });
    await Push.createChannel({id:'famipay_updates',name:'FAMIPAY',description:'FAMIPAY updates',importance:4,visibility:0});
  })();
  return pushReady;
}
async function enablePush() {
  if (!window.FAMIPAY_MOBILE_BUILD.push) return notice('unavailable');
  if (!native) return notice('unavailable');
  await window.Famina?.ready;
  if (!window.Famina?.user) return notice('signin');
  await setupPush();
  let permission=await Push.checkPermissions();
  if (permission.receive==='prompt' || permission.receive==='prompt-with-rationale') permission=await Push.requestPermissions();
  if (permission.receive!=='granted') return notice('denied');
  await Push.register();
}
async function authCallback(url) {
  const callback=new URL(url);
  if(callback.protocol!=='famipay:' || callback.hostname!=='auth' || callback.pathname!=='/login') return;
  const code=callback.searchParams.get('code');
  if(!code) return;
  await window.Famina?.ready;
  if(!window.Famina?.client) throw Error('Account service unavailable');
  const {error}=await window.Famina.client.auth.exchangeCodeForSession(code);
  if(error) throw error;
  await Browser.close().catch(()=>{});
  location.replace(callback.searchParams.get('recovery')==='1'?'login.html?recovery=1':'famipay-app.html');
}
async function boot() {
  document.body.classList.add('native-app');
  if(window.FAMIPAY_MOBILE_BUILD.preview){
    const banner=document.createElement('div');banner.id='preview-banner';banner.setAttribute('role','status');
    const label=()=>{banner.textContent={en:'Preview · No real money',fr:'Aperçu · Aucun argent réel',ar:'معاينة · بدون أموال حقيقية'}[lang()]||'Preview · No real money';};
    label();document.body.prepend(banner);new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }
  const tools=document.createElement('aside');tools.id='native-tools';
  const select=document.createElement('select');select.setAttribute('aria-label','Language / Langue / اللغة');
  for(const [value,label] of [['en','English'],['fr','Français'],['ar','العربية']]) select.add(new Option(label,value));
  select.value=lang();
  select.onchange=()=>{
    const language=select.value==='en'?'en':select.value+'-TD';
    localStorage.setItem('language',language);window.FaminaSession?.setPreference('language',language);
    localStorage.setItem('famipay-private-language',select.value);location.reload();
  };
  const notifications=document.createElement('button');notifications.textContent=t('notifications');
  notifications.hidden=Boolean(window.FAMIPAY_MOBILE_BUILD.preview);
  notifications.onclick=()=>enablePush().catch(()=>notice('error'));
  const updates=document.createElement('button');updates.textContent=t('updates');
  updates.onclick=()=>{
    const url=window.FAMIPAY_MOBILE_BUILD.releases;
    (native?Browser.open({url}):Promise.resolve(window.open(url,'_blank','noopener'))).catch(()=>notice('error'));
  };
  status=document.createElement('p');status.id='native-status';status.setAttribute('role','status');
  tools.append(select,notifications,updates,status);document.body.append(tools);
  const version=document.createElement('small');version.textContent=`FAMIPAY ${window.FAMIPAY_MOBILE_BUILD.version} (${window.FAMIPAY_MOBILE_BUILD.code})`;tools.append(version);
  const refreshLabels=()=>{
    select.value=lang();
    if(notifications.textContent!==t('notifications'))notifications.textContent=t('notifications');
    if(updates.textContent!==t('updates'))updates.textContent=t('updates');
  };
  new MutationObserver(refreshLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('offline',()=>notice('offline'));
  window.addEventListener('online',()=>{status.textContent='';});
  if(!navigator.onLine)notice('offline');
  if(!native)return;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link)return;
    const url=new URL(link.href,location.href);
    if(url.protocol==='https:'&&url.origin!==location.origin){event.preventDefault();Browser.open({url:url.href}).catch(()=>notice('error'));}
  });
  await App.addListener('backButton',({canGoBack})=>{
    const back=document.querySelector('[data-action="back"]');
    if(back)back.click();else if(canGoBack)history.back();else App.minimizeApp();
  });
  await App.addListener('appUrlOpen',event=>authCallback(event.url).catch(()=>notice('error')));
  const launch=await App.getLaunchUrl();if(launch?.url)await authCallback(launch.url).catch(()=>notice('error'));
  await SplashScreen.hide();
  if(window.FAMIPAY_MOBILE_BUILD.push){
    await window.Famina?.ready;
    if(window.Famina?.user && (await Push.checkPermissions()).receive==='granted')await enablePush();
  }
  window.addEventListener('famina-auth-updated',()=>{if(registration)bindToken(registration).catch(()=>notice('error'));});
  // Remove this device before the existing controller revokes the authenticated session.
  document.addEventListener('click',async event=>{
    const button=event.target.closest('[data-action="logout"]');
    if(!button || !window.FAMIPAY_MOBILE_BUILD.push || button.dataset.nativeLogout)return;
    event.stopImmediatePropagation();event.preventDefault();button.disabled=true;
    try {
      if(registration)await window.Famina.api('/push/devices',{method:'DELETE',body:{token:registration}});
      await Push.unregister();registration=null;button.dataset.nativeLogout='done';button.disabled=false;button.click();
    }catch{button.disabled=false;notice('error');}
  },true);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>boot().catch(()=>notice('error'))):boot().catch(()=>notice('error'));
