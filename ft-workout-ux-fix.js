/* FORM workout UX hardening v1.2 */
(()=>{'use strict';
const GLASS={
'Incline Chest Press':'Kürek kemiklerini sabitle; dirsekleri aşırı açma. Ağırlığı üst göğse kontrollü indir.',
'Lat Pulldown':'Göğsü hafif yukarıda tut; barı ellerle değil dirsekleri aşağı çekerek indir.',
'Machine Chest Press':'Omuzları öne kaçırma. Dirsek hattını göğüste gerilim kalacak açıda koru.',
'Seated Cable Row':'Gövdeyi savurma. Dirsekleri kalçaya sür ve kürek kemiklerini kontrollü kapat.',
'Machine Shoulder Press':'Belden destek alma. Dirsekleri omuz hattının biraz önünde tut.',
'Lateral Raise':'Ağırlığı elden değil dirsekten kaldır. Omzu silkmeden orta omuzda gerilimi koru.',
'Cable / Biceps Curl':'Dirsekleri sabit tut; omuzu öne taşımadan biceps sıkışmasını tamamla.',
'Triceps Pushdown':'Dirsekleri gövdeye kilitle; hareketi omuzdan değil dirsekten yap.',
'Back Squat':'Ayak tabanını sabitle; diz ve kalça birlikte kırılırken gövdeyi dengede tut.',
'Romanian Deadlift':'Kalçayı geriye sür; barı bacağa yakın tutup hamstring gerilimini koru.',
'Leg Press':'Belini pedden ayırma. Dizleri kilitlemeden kontrollü menzil kullan.',
'Leg Curl':'Kalçayı pedden kaldırma. Negatifi yavaşlat ve hamstringi tam kısalt.',
'Calf Raise':'Altta tam esneme, üstte tam sıkışma. Sekme yapma.',
'Cable Crunch':'Göğüs kafesini pelvise yaklaştır; kalçadan değil karından kıvrıl.',
'Incline Dumbbell Press':'Kürek kemiklerini sabitle; dirsekleri 30–45° hatta tut. Dumbbelları kontrollü indir.',
'Neutral / Close Grip Lat Pulldown':'Göğsü hafif yukarıda tut; dirsekleri ceplere götür.',
'Cable Fly — Low to High':'Dirsek açısını sabit tut; üst göğüste sıkışmaya odaklan.',
'Chest Supported Row':'Göğsü pedden ayırma. Dirsekleri geriye sür ve üstte kürek kemiklerini sık.',
'Reverse Pec Deck':'Omuzları yükseltme. Kolları değil arka omuzu geriye aç.',
'Hammer Curl':'Dirsekleri gövde yanında sabit tut; ön kolu sallama.',
'Overhead Cable Triceps Extension':'Dirsekleri başın yanında sabitle; tam germe ve sıkışma yap.'
};
function data(){try{return typeof db!=='undefined'?db:null}catch{return null}}
function exerciseAt(i){return data()?.program?.[window._wk]?.[i]||null}
function labelForSelect(sel){const v=sel?.value;return v==='working'?'Ana':v==='warmup'?'Isınma':v==='backoff'?'Back-off':v==='drop'?'Drop':'Set'}
function compactSetTypes(){document.querySelectorAll('.set-type-select').forEach(sel=>{const td=sel.closest('.set-type-cell');if(!td)return;[...sel.options].forEach(o=>{if(o.value==='working')o.textContent='Ana';else if(o.value==='warmup')o.textContent='Isınma';else if(o.value==='backoff')o.textContent='Back-off';else if(o.value==='drop')o.textContent='Drop'});td.dataset.setLabel=labelForSelect(sel)})}
function moveGlassNotes(){document.querySelectorAll('.workout-card').forEach((card,i)=>{const head=card.querySelector('.exercise-head');if(!head)return;let note=card.querySelector('.ft-glass-note');if(!note){const name=exerciseAt(i)?.name;const text=GLASS[name];if(text){note=document.createElement('details');note.className='ft-glass-note';note.innerHTML=`<summary>Glass notu</summary><div>${text}</div>`}}if(note&&head.nextElementSibling!==note)head.insertAdjacentElement('afterend',note)})}
function nextNumericInput(target){const m=String(target.id||'').match(/^(kg|rep|rir)_(\d+)_(\d+)$/);if(!m)return null;const [,kind,i,j]=m;let id;if(kind==='kg')id=`rep_${i}_${j}`;else if(kind==='rep')id=`rir_${i}_${j}`;else id=`kg_${i}_${Number(j)+1}`;return document.getElementById(id)}
function focusNext(target){if(!target||String(target.value||'').trim()==='')return;const next=nextNumericInput(target);if(!next)return;next.focus({preventScroll:true});if(typeof next.select==='function')next.select()}
function decorateSetInputs(){document.querySelectorAll('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]').forEach(input=>{input.setAttribute('inputmode','decimal');input.setAttribute('enterkeyhint','next');const td=input.closest('td');if(!td)return;td.classList.add('ft-number-cell');if(td.querySelector(`.ft-input-confirm[data-for="${input.id}"]`))return;const btn=document.createElement('button');btn.type='button';btn.className='ft-input-confirm';btn.dataset.for=input.id;btn.tabIndex=-1;btn.setAttribute('aria-label','Onayla ve sonraki alana geç');btn.textContent='✓';btn.addEventListener('pointerdown',e=>e.preventDefault());btn.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();focusNext(input)});td.appendChild(btn)})}
function normalizeCompactCards(){document.querySelectorAll('.card').forEach(c=>{const t=(c.textContent||'').trim();if(t.includes('Hazırlık verisi'))c.classList.add('ft-readiness-compact');if(t.includes('Kas grubu ilerlemesi'))c.classList.add('ft-muscle-compact')});const r=document.getElementById('ftIQRpe');if(r)r.classList.add('ft-rpe-compact');document.querySelector('.workout-footer')?.classList.add('ft-footer-compact')}
function diagnostics(){const issues=[];const ids=[...document.querySelectorAll('[id]')].map(x=>x.id),dup=ids.filter((x,i)=>ids.indexOf(x)!==i);if(dup.length)issues.push(`duplicate-id:${[...new Set(dup)].join(',')}`);if(window._wk!=='HYROX Hybrid'){document.querySelectorAll('.workout-card').forEach((card,i)=>{const rows=card.querySelectorAll('tbody tr');rows.forEach((tr,j)=>{for(const id of [`kg_${i}_${j}`,`rep_${i}_${j}`,`rir_${i}_${j}`,`done_${i}_${j}`])if(!document.getElementById(id))issues.push(`missing:${id}`)});if(!card.querySelector('.ft-glass-note')){const name=exerciseAt(i)?.name;if(GLASS[name])issues.push(`glass:${name}`)}});for(const fn of ['formStartWorkout','formPauseWorkout','saveWorkout','formAddSet','formRemoveSet'])if(typeof window[fn]!=='function')issues.push(`fn:${fn}`)}return{ok:issues.length===0,issues}}
window.ftWorkoutSelfCheck=diagnostics;
function enhance(){compactSetTypes();moveGlassNotes();decorateSetInputs();normalizeCompactCards();window.__ftWorkoutLastCheck=diagnostics()}
document.addEventListener('change',e=>{if(e.target?.matches?.('.set-type-select')){const td=e.target.closest('.set-type-cell');if(td)td.dataset.setLabel=labelForSelect(e.target)}},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target?.matches?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')){e.preventDefault();focusNext(e.target)}},true);
const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(enhance,160);return r};
const addSet=window.addExtraSet;if(typeof addSet==='function')window.addExtraSet=function(){const r=addSet.apply(this,arguments);setTimeout(decorateSetInputs,0);return r};
setTimeout(enhance,260);
})();
