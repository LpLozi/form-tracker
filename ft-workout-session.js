/* FORM workout session persistence — offline-first draft + recovery */
(()=>{'use strict';
const KEY='FORM_WORKOUT_DRAFT_V1', LAST='FORM_LAST_WORKOUT_SAVED_V1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
const write=d=>{try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch{return false}};
const clear=()=>{try{localStorage.removeItem(KEY)}catch{}};
const val=id=>document.getElementById(id)?.value??'';
function capture(){
  if(typeof current!=='undefined'&&current!=='Antrenman')return null;
  const tables=[...document.querySelectorAll('[id^="settable_"]')]; if(!tables.length)return null;
  const prev=read()||{}, type=window._wk||prev.type||'', date=val('workoutDate')||prev.date||'', exercises=[];
  tables.forEach((tb,i)=>{const sets=[...tb.querySelectorAll('tbody tr')].map((tr,j)=>({weight:val(`kg_${i}_${j}`),reps:val(`rep_${i}_${j}`),rir:val(`rir_${i}_${j}`),done:!!document.getElementById(`done_${i}_${j}`)?.checked}));exercises.push({sets,note:val(`note_${i}`)})});
  const cardio={type:val('cardioType'),minutes:val('cardioMin'),speed:val('cardioSpeed'),incline:val('cardioIncline'),intensity:val('cardioIntensity')};
  const startedAt=window._workoutStart||prev.startedAt||null;
  const d={version:1,type,date,startedAt,updatedAt:Date.now(),exercises,cardio,rpe:val('ftSessionRpe')}; write(d); return d;
}
function hasData(d){return !!d?.exercises?.some(e=>e.note||e.sets?.some(s=>s.weight||s.reps||s.rir||s.done))}
function restore(){
  const d=read(); if(!d||!document.querySelector('[id^="settable_"]'))return;
  if(d.type&&window._wk!==d.type){window._wk=d.type;setTimeout(()=>window.renderWorkout?.(),0);return}
  if(d.startedAt&&!window._workoutStart)window._workoutStart=d.startedAt;
  if(d.date&&document.getElementById('workoutDate'))document.getElementById('workoutDate').value=d.date;
  d.exercises?.forEach((e,i)=>{const tb=document.querySelector(`#settable_${i} tbody`);if(!tb)return;while(tb.rows.length<(e.sets?.length||0))window.addExtraSet?.(i);e.sets?.forEach((s,j)=>{const a=document.getElementById(`kg_${i}_${j}`),b=document.getElementById(`rep_${i}_${j}`),c=document.getElementById(`rir_${i}_${j}`),x=document.getElementById(`done_${i}_${j}`);if(a)a.value=s.weight??'';if(b)b.value=s.reps??'';if(c)c.value=s.rir??'';if(x)x.checked=!!s.done});const n=document.getElementById(`note_${i}`);if(n)n.value=e.note||''});
  const c=d.cardio||{};[['cardioType','type'],['cardioMin','minutes'],['cardioSpeed','speed'],['cardioIncline','incline'],['cardioIntensity','intensity']].forEach(([id,k])=>{const el=document.getElementById(id);if(el&&c[k]!=null)el.value=c[k]});const r=document.getElementById('ftSessionRpe');if(r&&d.rpe)r.value=d.rpe;
  if(hasData(d))injectResumeBadge(d);
}
function injectResumeBadge(d){if(document.getElementById('ftDraftBadge'))return;const first=document.querySelector('.workout-card')?.parentElement||document.querySelector('#app>.card');if(!first)return;const el=document.createElement('div');el.id='ftDraftBadge';el.style='margin:0 0 10px;padding:10px 12px;border:1px solid #cfe0ff;border-radius:12px;background:#f3f7ff;color:#284f86;font-size:12px;font-weight:700';el.textContent='✓ Devam eden antrenman cihazda kayıtlı — kaldığın yerden devam edebilirsin.';first.parentElement?.insertBefore(el,first)}
function injectSavedBadge(){let x;try{x=JSON.parse(localStorage.getItem(LAST)||'null')}catch{} if(!x||Date.now()-x.at>6*60*60*1000||document.getElementById('ftSavedBadge'))return;const appEl=document.getElementById('app');if(!appEl)return;const el=document.createElement('div');el.id='ftSavedBadge';el.style='margin:0 0 12px;padding:12px 14px;border:1px solid #bfe8cf;border-radius:14px;background:#eefbf3;color:#17603a;font-size:13px;font-weight:800';el.textContent=`✓ Antrenman kaydedildi — ${x.date||''} ${x.type||''}`;appEl.prepend(el)}
function afterRender(){restore();injectSavedBadge()}
const oldStart=window.startWorkout; if(oldStart)window.startWorkout=function(...a){const o=oldStart.apply(this,a);setTimeout(capture,0);return o};
const oldSave=window.saveWorkout; if(oldSave)window.saveWorkout=function(...a){let d=capture()||read();if(!window._workoutStart&&hasData(d)){window._workoutStart=d?.startedAt||Date.now();d={...(d||{}),startedAt:window._workoutStart};write(d)}const n=(db.workouts||[]).length,o=oldSave.apply(this,a);if((db.workouts||[]).length>n){const w=db.workouts.at(-1);clear();try{localStorage.setItem(LAST,JSON.stringify({at:Date.now(),date:w?.date,type:w?.type}))}catch{}setTimeout(injectSavedBadge,0)}else capture();return o};
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(afterRender);else{const rw=window.renderWorkout;if(rw)window.renderWorkout=function(...a){const o=rw.apply(this,a);setTimeout(afterRender,0);return o}};
document.addEventListener('input',e=>{if(e.target?.closest?.('#app'))setTimeout(capture,0)},true);document.addEventListener('change',e=>{if(e.target?.closest?.('#app'))setTimeout(capture,0)},true);
window.addEventListener('pagehide',capture);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')capture()});setInterval(()=>{if(typeof current!=='undefined'&&current==='Antrenman')capture()},1500);
const d=read();if(d?.startedAt&&!window._workoutStart)window._workoutStart=d.startedAt;setTimeout(()=>{try{if(typeof current!=='undefined'&&current==='Antrenman')afterRender();else injectSavedBadge()}catch{}},120);
})();