/* FORM — 20.10.2026 ekran görüntülerindeki dört günlük planın birebir hedef sunumu */
(()=>{'use strict';
const ORIGIN='exact-screenshots-2026-10-20';
const cardioNames=['1. Gün — Göğüs / Arka Kol','2. Gün — Sırt / Pazu','3. Gün — Omuz / Karın','4. Gün — Bacak'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function current(){try{return (db.program?.[window._wk]||[]).map(x=>typeof normalizeExercise==='function'?normalizeExercise(x):x)}catch{return []}}
function isExact(rows){return rows.some(x=>x?.source===ORIGIN)}
function targetFor(e,index){
 const parts=String(e.reps||'').match(/\([^)]*\)|[^-]+/g)||[];
 return parts.length===1?parts[0]:(parts[index]||'—');
}
function addBadge(head,e){
 if(!head||head.closest('.workout-card')?.querySelector('.ft-exact-tagline'))return;
 const badge=document.createElement('div');badge.className='ft-exact-tagline';
 badge.innerHTML='<span class="ft-exact-group">'+esc(e.group||'')+'</span>'+
  (e.stretch?'<span class="ft-exact-pill">Esneme • '+esc(e.reps)+'</span>':'')+
  (e.supersetWith?'<span class="ft-exact-pill">Süper Set ↔ '+esc(e.supersetWith)+'</span>':'');
 head.insertAdjacentElement('beforebegin',badge);
}
function annotateSets(card,e,i){
 const table=card.querySelector('#settable_'+i);if(!table)return;
 const repHead=[...table.querySelectorAll('thead th')].find(th=>th.textContent.trim().toLocaleUpperCase('tr-TR')==='TEKRAR');
 if(repHead&&!table.querySelector('.ft-exact-target-head')){
  const th=document.createElement('th');th.className='ft-exact-target-head';th.textContent='HEDEF';
  repHead.insertAdjacentElement('beforebegin',th);
 }
 [...table.querySelectorAll('tbody tr')].forEach((tr,j)=>{
  const rep=tr.querySelector('#rep_'+i+'_'+j);if(!rep)return;
  const cell=rep.closest('td');if(!cell)return;
  const target=targetFor(e,j);
  if(!tr.querySelector('.ft-exact-target-cell')){
   const td=document.createElement('td');td.className='ft-exact-target-cell';td.innerHTML='<span>'+esc(target)+'</span>';
   cell.insertAdjacentElement('beforebegin',td);
  }else tr.querySelector('.ft-exact-target-cell span').textContent=target;
  if(/^\d+$/.test(target)&&!rep.value)rep.placeholder=target;
  const type=tr.querySelector('#type_'+i+'_'+j);
  if(type&&target.toLocaleLowerCase('tr-TR')==='ds'&&!tr.dataset.ftExactType){type.value='drop';tr.dataset.ftExactType='1'}
 });
}
function markCard(card,e,i){
 const head=card.querySelector('.exercise-head');addBadge(head,e);
 const meta=card.querySelector('.ft-exact-details')||document.createElement('div');
 if(!meta.classList.contains('ft-exact-details'))meta.className='ft-exact-details';
 let details=[];
 if(e.displayReps)details.push('<strong>Tekrar:</strong> '+esc(e.displayReps));
 if(e.note)details.push(esc(e.note));
 if(e.partialTargets)details.push('Görselde 6 set yazıyor; 5. ve 6. setin tekrar hedefleri görünmüyor. Değer eklenmedi.');
 if(details.length){
  meta.innerHTML=details.map(x=>'<div>'+x+'</div>').join('');
  if(!meta.isConnected)head?.insertAdjacentElement('afterend',meta);
 }
 annotateSets(card,e,i);
}
function cardioNote(){
 const x=[...document.querySelectorAll('.card h2')].find(el=>el.textContent.trim()==='Kardiyo finisher');
 const card=x?.closest('.card');if(!card)return;
 const needed=cardioNames.includes(window._wk);
 card.classList.toggle('ft-exact-cardio',needed);
 card.querySelector('.ft-exact-cardio-note')?.remove();
 if(!needed)return;
 const el=document.createElement('div');el.className='ft-exact-cardio-note';
 el.innerHTML='<b>Koşu Bandı (Treadmill) — 50 dk</b>'+
 '<p>5-6 km/saat hızla %15 eğim ile yapılacaktır. Sabah aç karnına ya da antrenmandan hemen sonrası yapılması uygundur.</p>'+
 '<p><strong>Eş değerleri:</strong> 90 dk hızlı tempo düz yolda yürüyüş / 50 dk orta düzey direnç bisiklet ya da eliptik.</p>';
 card.insertBefore(el,card.firstElementChild?.nextSibling||null);
}
function decorate(){
 const rows=current(),exact=isExact(rows);
 document.body.classList.toggle('ft-exact-plan',exact);
 if(!exact)return;
 [...document.querySelectorAll('.workout-card')].slice(0,rows.length).forEach((card,i)=>markCard(card,rows[i],i));
 cardioNote();
 const f=document.getElementById('f2work');if(f){f.querySelector('b:last-child')?.remove();if(!f.querySelector('.ft-exact-coach-label')){const tag=document.createElement('div');tag.className='ft-exact-coach-label';tag.textContent='ERTUĞ EVREKLİ • ORİJİNAL PROGRAM';f.firstElementChild?.prepend(tag)}}
}
const css=document.createElement('style');css.id='ftExactPlanCss';css.textContent=`
body.ft-exact-plan .ftsmart-cue,body.ft-exact-plan .ftsmart-tech,body.ft-exact-plan .ftsmart-tempo,body.ft-exact-plan .ftv3-target{display:none!important}
body.ft-exact-plan .ftsmart-chips .ftsmart-chip:not(:first-child){display:none!important}
.ft-exact-coach-label{font-weight:900;font-size:10px;letter-spacing:.04em;color:#135da8;margin-bottom:4px}.ft-exact-tagline{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:0 0 7px}
.ft-exact-group{font-size:10px;font-weight:900;letter-spacing:.055em;color:#2556a1;background:#eff5ff;border:1px solid #d7e5ff;padding:4px 7px;border-radius:7px}
.ft-exact-pill{font-size:10px;font-weight:750;background:#fff8dc;color:#865d0c;border:1px solid #f2da89;padding:4px 6px;border-radius:7px}
.ft-exact-target-cell,.ft-exact-target-head{text-align:center;white-space:nowrap}
.ft-exact-target-cell span{display:inline-block;max-width:116px;padding:4px 5px;border-radius:7px;background:#edf5fd;font-size:11px;font-weight:750;color:#28568b}
.ft-exact-details{padding:7px 9px;margin:4px 0 9px;border:1px solid #f1dfb3;border-radius:9px;background:#fffdf5;font-size:11px;line-height:1.5}
.ft-exact-cardio-note{border:1px solid #dfebff;border-radius:10px;padding:12px;margin:10px 0;color:#34445c;background:#f7faff;font-size:12px;line-height:1.45}
.ft-exact-cardio-note b{display:block;font-size:13px}.ft-exact-cardio-note p{margin:7px 0 0}
@media(max-width:700px){.ft-exact-target-cell span{font-size:10px;max-width:85px;white-space:normal}.ft-exact-target-cell{padding:2px!important}.ft-exact-target-head{font-size:9px!important}}
`;document.head.appendChild(css);
const original=window.renderWorkout;
if(typeof original==='function')window.renderWorkout=function(){const result=original.apply(this,arguments);decorate();[70,350,900,1450].forEach(ms=>setTimeout(decorate,ms));return result};
decorate();setTimeout(decorate,1300);
})();
