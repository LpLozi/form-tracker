/* FORM HYROX compact controls (timer, hero layout). Program selection itself
 * is owned exclusively by schedule-v2.js's <select onchange>/window._wk —
 * this file used to also inject a second, independent "#ftHyroxDaySelect"
 * program picker with its own change handler and its own hardcoded
 * day->program list, which was a second place a program switch could
 * originate from. Removed in favor of the one real selector. */
(()=>{'use strict';
let pausedAt=0;
function fmt(sec){sec=Math.max(0,Math.floor(sec||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')}
function elapsed(){if(!window._workoutStart)return 0;const end=pausedAt||Date.now();return Math.max(0,Math.floor((end-window._workoutStart)/1000))}
function tick(){clearInterval(window._timerInt);if(pausedAt)return;window._timerInt=setInterval(()=>{const e=document.getElementById('workoutTimer');if(e)e.textContent=fmt(elapsed());else clearInterval(window._timerInt)},1000)}
window.ftStartHyrox=function(){
  if(pausedAt&&window._workoutStart){window._workoutStart+=Date.now()-pausedAt;pausedAt=0}
  else if(!window._workoutStart){window._workoutStart=Date.now()}
  window.renderWorkout?.();
};
window.ftPauseHyrox=function(){
  if(!window._workoutStart||pausedAt)return;
  pausedAt=Date.now();
  clearInterval(window._timerInt);
  const e=document.getElementById('workoutTimer');if(e)e.textContent=fmt(elapsed());
  decorate();
};
function compactHero(first){
  const h2=first.querySelector('h2');
  if(h2)h2.style.cssText='margin:2px 0 3px;font-size:20px;line-height:1.05;letter-spacing:-.02em';
  const muted=[...first.querySelectorAll('.muted')];
  muted.forEach((el,i)=>{if(i===0)el.style.fontSize='11px';else if(!el.closest('[style*="text-align:right"]')){el.style.fontSize='11px';el.style.lineHeight='1.25'}});
  const timer=first.querySelector('#workoutTimer');if(timer){timer.style.fontSize='24px';timer.style.lineHeight='1';timer.textContent=fmt(elapsed())}
  const timerLabel=timer?.previousElementSibling;if(timerLabel)timerLabel.style.fontSize='10px';
  first.style.padding='12px';
}
function controls(first){
  let row=first.querySelector('#ftHyroxControls');
  const old=[...first.querySelectorAll('button')].find(b=>b.textContent.includes('Antrenmanı başlat')||b.textContent.includes('Antrenman başladı'));
  if(old)old.remove();
  if(!row){row=document.createElement('div');row.id='ftHyroxControls';row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px';first.appendChild(row)}
  const started=!!window._workoutStart;
  row.innerHTML=`<button class="primary" style="padding:8px 10px;font-size:12px" onclick="ftStartHyrox()">${started?(pausedAt?'Devam et':'Çalışıyor'):'Başlat'}</button><button class="secondary" style="padding:8px 10px;font-size:12px" onclick="ftPauseHyrox()" ${!started||pausedAt?'disabled':''}>Duraklat</button>`;
}
function decorate(){
  if(window._wk!=='HYROX Hybrid')return;
  const root=document.getElementById('app')||window.app;
  if(!root)return;
  const first=root.querySelector('.card');
  if(!first)return;
  compactHero(first);controls(first);tick();
}
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(decorate);
else{const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(decorate,0);return r}}
setTimeout(decorate,80);
})();