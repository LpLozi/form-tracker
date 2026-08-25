/* Temporary preview-only draft persistence diagnostics. Active only with ?debugdraft=1 */
(()=>{'use strict';
if(!new URLSearchParams(location.search).has('debugdraft'))return;
const PREFIX='FORM_WORKOUT_DRAFT_V2:';
const k=t=>PREFIX+encodeURIComponent(t||'unknown');
const read=t=>{try{return JSON.parse(localStorage.getItem(k(t))||'null')}catch{return null}};
function first(d){const s=d?.exercises?.[0]?.sets?.[0]||{};return `${s.weight??''}/${s.reps??''}/${s.rir??''}${s.done?'✓':''}`}
function ensure(){let e=document.getElementById('ftDraftDebug');if(e)return e;e=document.createElement('div');e.id='ftDraftDebug';e.style='position:fixed;left:8px;right:8px;bottom:86px;z-index:99999;background:#111827;color:#fff;padding:9px 10px;border-radius:10px;font:11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;box-shadow:0 4px 18px rgba(0,0,0,.28);pointer-events:none';document.body.appendChild(e);return e}
function paint(tag){const plan=window._wk||'-',d=read(plan),dom=[document.getElementById('kg_0_0')?.value??'',document.getElementById('rep_0_0')?.value??'',document.getElementById('rir_0_0')?.value??''].join('/');const keys=[];for(let i=0;i<localStorage.length;i++){const x=localStorage.key(i);if(x?.startsWith(PREFIX))keys.push(decodeURIComponent(x.slice(PREFIX.length)))}ensure().textContent=`DRAFT DEBUG 205 | ${tag} | plan=${plan} | DOM=${dom} | saved=${first(d)} | keys=${keys.join(',')||'-'}`}
document.addEventListener('input',()=>setTimeout(()=>paint('input'),0),true);
document.addEventListener('change',e=>{paint(e.target?.id==='ftProgramSelect'?'select-capture':'change');setTimeout(()=>paint('change+50'),50)},true);
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(()=>paint('afterRender'));else setInterval(()=>paint('poll'),500);
setInterval(()=>paint('tick'),700);
setTimeout(()=>paint('boot'),200);
})();
