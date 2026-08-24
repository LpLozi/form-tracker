/* FORM HYROX day/program selector + compact controls */
(()=>{'use strict';
const DAYS=[
  ['Pazar','Upper Strength'],
  ['Salı','Lower Strength'],
  ['Perşembe','Upper Hypertrophy'],
  ['Cuma','HYROX Hybrid']
];
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
function addPicker(root,first){
  if(root.querySelector('#ftHyroxDayPicker'))return;
  const box=document.createElement('div');
  box.id='ftHyroxDayPicker';
  box.className='card';
  box.style.cssText='padding:8px 10px;margin-bottom:8px;border-radius:14px';
  box.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><label style="margin:0;font-size:9px;font-weight:850;white-space:nowrap">ANTRENMAN</label><select id="ftHyroxDaySelect" style="margin:0;min-width:0;flex:1;padding:7px 28px 7px 9px;font-size:13px;height:36px">${DAYS.map(([day,plan])=>`<option value="${plan}" ${window._wk===plan?'selected':''}>${day} • ${plan}</option>`).join('')}</select></div>`;
  first.insertAdjacentElement('beforebegin',box);
  box.querySelector('#ftHyroxDaySelect').addEventListener('change',e=>{window._wk=e.target.value;window.renderWorkout?.()});
}
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
  addPicker(root,first);compactHero(first);controls(first);tick();
}
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(decorate);
else{const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(decorate,0);return r}}
setTimeout(decorate,80);
})();
