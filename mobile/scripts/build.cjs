const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {build}=require('esbuild');
const root=path.resolve(__dirname,'../..'),mobile=path.join(root,'mobile'),out=path.join(mobile,'www');
const api=process.env.FAMIPAY_MOBILE_API_URL||'https://faminaexpress.onrender.com/api',parsed=new URL(api);
if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error('A public HTTPS API URL is required');
const code=Number(process.env.ANDROID_VERSION_CODE||1);
const preview=process.env.FAMIPAY_MOBILE_PREVIEW==='true';
if(!Number.isSafeInteger(code)||code<1||code>2100000000)throw Error('Invalid Android version code');
const terms=process.env.FAMIPAY_MOBILE_TERMS_URL,privacy=process.env.FAMIPAY_MOBILE_PRIVACY_URL;
for(const url of [terms,privacy].filter(Boolean)){const value=new URL(url);if(value.protocol!=='https:'||value.username||value.password)throw Error('Policy URLs must use HTTPS');}
// Rebuild the isolated output from an explicit financial-app allowlist.
if(out!==path.join(root,'mobile','www'))throw Error('Unexpected output directory');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
function write(file,content){const dest=path.join(out,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,content);}
function copy(file){write(file,fs.readFileSync(path.join(root,file)));}
for(const name of ['loading','notifications','i18n','supabase-auth'])copy('assets/js/'+name+'.js');
copy('assets/vendor/supabase.js');
for(const name of ['famipay-logo.svg','famipay-logo-dark.svg','famipay-mark.svg'])copy('assets/branding/'+name);
for(const name of ['famipay-app','auth','notifications','loading'])copy('assets/css/'+name+'.css');
// Share account authentication without the web app's commerce notification subscription.
let platform=fs.readFileSync(path.join(root,'assets/js/platform.js'),'utf8');
const subscription=platform.indexOf('  document.addEventListener("DOMContentLoaded", async () => {');
if(subscription<0)throw Error('Review shared account controller before packaging');
write('assets/js/platform.js',platform.slice(0,subscription)+'})();\n');
write('assets/js/session.js',fs.readFileSync(path.join(mobile,'src/session.js')));
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/famipay-translations.js'),'utf8'),context);
const excluded=/food|restaurant|cart|order|delivery|agriculture|online shop|products|latitude|longitude|subtotal|checkout|item added|view menu|\+ add|label/i;
const translations=Object.fromEntries(Object.entries(context.window.FamipayTranslations).filter(([key])=>!excluded.test(key)));
Object.assign(translations,{
 Transactions:{fr:'Transactions',ar:'المعاملات'},
 'Transaction history is not connected yet.':{fr:'L’historique des transactions n’est pas encore connecté.',ar:'سجل المعاملات غير متصل بعد.'},
 'Financial notifications are not connected yet.':{fr:'Les notifications financières ne sont pas encore connectées.',ar:'الإشعارات المالية غير متصلة بعد.'},
 Terms:{fr:'Conditions',ar:'الشروط'},Privacy:{fr:'Confidentialité',ar:'الخصوصية'},
 'Your account uses email or phone authentication.':{fr:'Votre compte utilise une authentification par e-mail ou téléphone.',ar:'يستخدم حسابك المصادقة بالبريد الإلكتروني أو الهاتف.'},
 'Support contact details are not configured yet.':{fr:'Les coordonnées de l’assistance ne sont pas encore configurées.',ar:'لم يتم إعداد تفاصيل الاتصال بالدعم بعد.'}
});
write('assets/js/famipay-translations.js','window.FamipayTranslations='+JSON.stringify(translations)+';');
const catalogs={};
for(const language of ['en','fr-TD','ar-TD']){
 const original=JSON.parse(fs.readFileSync(path.join(root,'assets/locales/'+language+'.json'),'utf8'));
 catalogs[language]={auth:original.auth,footer:{terms:original.footer.terms,privacy:original.footer.privacy},nav:{access:original.nav.access},text:{},preserved:['FAMIPAY']};
 catalogs[language].auth.subtitle={en:'Welcome to FAMIPAY.','fr-TD':'Bienvenue sur FAMIPAY.','ar-TD':'مرحباً بك في FAMIPAY.'}[language];
}
write('assets/locales/catalog.js','window.FAMINA_TRANSLATIONS='+JSON.stringify(catalogs)+';');
const head='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>FAMIPAY</title><link rel="stylesheet" href="assets/css/famipay-app.css"><link rel="stylesheet" href="assets/css/notifications.css"><link rel="stylesheet" href="assets/css/loading.css"><link rel="stylesheet" href="native.css"><script src="native-config.js"></script><script src="native.js" defer></script>';
const common=['loading','session','notifications'].map(name=>`<script src="assets/js/${name}.js"></script>`).join('')+'<script src="assets/vendor/supabase.js"></script><script src="assets/js/platform.js"></script>';
const previewCommon=['loading','session','notifications'].map(name=>`<script src="assets/js/${name}.js"></script>`).join('')+'<script src="preview-service.js"></script>';
write('legal.html',`<!doctype html><html lang="fr"><head>${head}</head><body class="mobile-auth"><main><a href="register.html">← FAMIPAY</a><h1 id="terms">Terms / Conditions / الشروط</h1><p>Financial service terms have not been published. Registration is unavailable until the financial account terms and privacy policy are configured.</p><p>Les conditions des services financiers ne sont pas publiées. L’inscription reste indisponible jusqu’à la configuration des conditions et de la politique de confidentialité.</p><p lang="ar" dir="rtl">لم يتم نشر شروط الخدمات المالية. التسجيل غير متاح حتى إعداد شروط الحساب وسياسة الخصوصية.</p><h2 id="privacy">Privacy / Confidentialité / الخصوصية</h2></main></body></html>`);
write('famipay-app.html',`<!doctype html><html lang="fr"><head>${head}</head><body><div id="app"></div>${preview?previewCommon:common}<script src="assets/js/famipay-translations.js"></script><script src="app.js"></script></body></html>`);
write('index.html','<!doctype html><html><head><meta charset="utf-8"><title>FAMIPAY</title></head><body><script>location.replace("famipay-app.html")</script><a href="famipay-app.html">FAMIPAY</a></body></html>');
for(const page of ['login','register']){
 const source=fs.readFileSync(path.join(root,page+'.html'),'utf8');
 const start=source.indexOf('<section class="form-section auth-card">'),end=source.indexOf('</main>',start);
 if(start<0||end<0)throw Error('Shared authentication structure changed');
 let card=source.slice(start,end).replace(/\s*<\/div>\s*$/,'').replace('Your next delicious moment starts here.','Welcome to FAMIPAY.');
 card=card.replaceAll('href="terms.html"','href="legal.html#terms"').replaceAll('href="privacy.html"','href="legal.html#privacy"').replaceAll(' target="_blank"','');
 if(terms&&privacy)card=card.replaceAll('href="legal.html#terms"',`href="${terms.replaceAll('&','&amp;').replaceAll('"','&quot;')}"`).replaceAll('href="legal.html#privacy"',`href="${privacy.replaceAll('&','&amp;').replaceAll('"','&quot;')}"`);
 else if(page==='register')card=card.replace('<button type="submit" class="submit-btn"','<button type="submit" class="submit-btn" disabled title="Financial account terms and privacy policy must be configured"');
 write(page+'.html',`<!doctype html><html lang="fr"><head>${head}<link rel="stylesheet" href="assets/css/auth.css"></head><body class="mobile-auth" data-auth-page="${page}"><header class="auth-brand"><a href="famipay-app.html"><img src="assets/branding/famipay-logo.svg" alt="FAMIPAY"></a></header><main>${card}</main>${common}<script src="assets/locales/catalog.js"></script><script src="assets/js/i18n.js"></script><script src="assets/js/supabase-auth.js"></script></body></html>`);
}
const authFile=path.join(out,'assets/js/supabase-auth.js');
write('assets/js/supabase-auth.js',fs.readFileSync(authFile,'utf8').replace('function appUrl(path) {','function appUrl(path) { if (window.Capacitor?.isNativePlatform()) return "famipay://auth/login" + (path.includes("recovery=1") ? "?recovery=1" : "");').replace('    await F.Cart?.merge();',''));
if(preview){
 for(const page of ['login','register'])write(page+'.html',`<!doctype html><html lang="en"><head>${head}</head><body class="mobile-auth"><main><h1>FAMIPAY Preview</h1><p>No sign-in needed / Sans connexion / بدون تسجيل دخول</p><a class="auth-link" href="famipay-app.html">Open preview / Ouvrir / فتح المعاينة</a></main></body></html>`);
 // An inspection APK includes no hosted authentication controller or account SDK.
 for(const file of ['assets/js/platform.js','assets/js/supabase-auth.js','assets/vendor/supabase.js'])fs.rmSync(path.join(out,file));
}
write('native-config.js',`window.FAMINA_API_BASE=${JSON.stringify(api)};window.FAMIPAY_MOBILE_BUILD=${JSON.stringify({version:process.env.ANDROID_VERSION_NAME||require('../package.json').version,code,preview,push:!preview&&process.env.FAMIPAY_MOBILE_PUSH_ENABLED==='true',releases:'https://github.com/devsmaj/Famipay/releases/tag/famipay-preview'})};`);
write('native.css',fs.readFileSync(path.join(mobile,'src/native.css')));
build({absWorkingDir:mobile,tsconfigRaw:{},entryPoints:['src/native.js','src/app.js',...(preview?['src/preview-service.js']:[])],bundle:true,outdir:out,target:'chrome110',format:'iife'}).catch(error=>{console.error(error);process.exitCode=1;});
