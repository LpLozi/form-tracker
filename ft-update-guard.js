/* FORM PWA update guard — non-destructive update prompt for iPhone Home Screen apps */
(()=>{'use strict';
 const CURRENT='2.1.10';
 const VERSION_URL='/version.json';
 const INTERVAL=120000;
 let lastCheck=0,checking=false,prompted='';
 function newer(a,b){
  const aa=String(a).split('.').map(Number),bb=String(b).split('.').map(Number);
  for(let i=0;i<Math.max(aa.length,bb.length);i++){
   if((aa[i]||0)>(bb[i]||0))return true;
   if((aa[i]||0)<(bb[i]||0))return false;
  }
  return false;
 }
 function promptUpdate(version){
  if(prompted===version||document.getElementById('formUpdateNotice'))return;
  prompted=version;
  const el=document.createElement('div');el.id='formUpdateNotice';
  el.setAttribute('role','status');
  el.style.cssText='position:fixed;z-index:999999;left:12px;right:12px;top:max(14px,env(safe-area-inset-top));background:#122346;color:#fff;border:1px solid #5387fb;border-radius:14px;padding:12px 14px;box-shadow:0 12px 40px #182b4b44;font:13px -apple-system,BlinkMacSystemFont,Arial,sans-serif;display:flex;align-items:center;gap:10px';
  const label=document.createElement('span');label.style.cssText='flex:1;line-height:1.4';label.textContent='FORM güncellemesi hazır ('+version+'). Kayıtlarını silmeden yeni sürüme geç.';
  const btn=document.createElement('button');btn.textContent='Yenile';btn.style.cssText='background:#3b82f6;color:#fff;border:0;border-radius:9px;padding:10px 12px;font-weight:800';
  btn.onclick=async()=>{
   if(window._workoutStart&&!confirm('Devam eden antrenmandaki kaydedilmemiş bilgiler kaybolabilir. Yine de yenilensin mi?'))return;
   btn.disabled=true;btn.textContent='Güncelleniyor';
   try{const registration=await navigator.serviceWorker?.getRegistration();await registration?.update()}catch(e){}
   location.replace('/index.html?form_release='+encodeURIComponent(version)+'&refresh='+Date.now());
  };
  const dismiss=document.createElement('button');dismiss.textContent='×';dismiss.setAttribute('aria-label','Daha sonra');dismiss.style.cssText='color:#fff;background:transparent;border:0;font-size:25px;line-height:1;padding:4px';
  dismiss.onclick=()=>el.remove();
  el.append(label,btn,dismiss);document.body.appendChild(el);
 }
 async function check(force=false){
  if(checking||(!force&&Date.now()-lastCheck<60000)||document.visibilityState==='hidden')return;
  checking=true;lastCheck=Date.now();
  try{
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),5000);
   let r;try{r=await fetch(VERSION_URL+'?check='+Date.now(),{cache:'no-store',signal:controller.signal})}finally{clearTimeout(timeout)}
   if(!r?.ok)return;
   const j=await r.json();
   if(j&&newer(j.version,CURRENT))promptUpdate(String(j.version));
  }catch(e){}finally{checking=false}
 }
 window.FORM_UPDATE_GUARD={version:CURRENT,check:()=>check(true)};
 window.addEventListener('pageshow',()=>check(true));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check(true)});
 window.addEventListener('focus',()=>check(true));
 setInterval(()=>{if(document.visibilityState==='visible')check()},INTERVAL);
 setTimeout(()=>check(true),2000);
})();