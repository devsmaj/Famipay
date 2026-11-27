(function(){
 const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
 const clear=()=>{for(const key of ['token','currentUser','faminaAuthProvider'])localStorage.removeItem(key);window.dispatchEvent(new Event('famina-session-change'));};
 window.FaminaSession={getPreference:read,
  setPreference(key,value){if(key==='language'&&['en','fr-TD','ar-TD'].includes(value))localStorage.setItem(key,value);},clear,
  save(token,user,provider){localStorage.setItem('token',token);localStorage.setItem('currentUser',JSON.stringify(user));localStorage.setItem('faminaAuthProvider',provider);},
  rememberPage(){},returnUrl(){return 'famipay-app.html';},
  gate(container,message){if(container){const p=document.createElement('p');p.textContent=message;container.prepend(p);}}
 };
})();
