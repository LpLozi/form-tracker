/* FORM workout UI v2.3 — today first, compact and predictable */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const norm=r=>{try{return normalizeExercise(r)}catch{return r||{}}};
function rows(){return (db.program?.[window._wk]||[]).map(norm)}
function history(name,n=8){return (db.workouts||[]).filter(w=>w.exercises?.some(e=>e.name===name)).sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(-n).map(w=>({date:w.date,e:w.exercises.find(e=>e.name===name)}))}
function sets(e){return (e?.setData||[]).filter(x=>x.done||x.weight||x.reps)}
function summary(e){const s=sets(e);if(!s.length)return'—';return s.map(x=>`${x.weight?`${Number(x.weight).toLocaleString('tr-TR',{maximumFractionDigits:1})} kg × `:''}${x.reps||'—'}`).join(' / ')}
function best(e){const s=sets(e);if(!s.length)return'—';const x=s.reduce((a,b)=>((+b.weight||0)*(+b.reps||0)>(+a.weight||0)*(+a.reps||0)?b:a),s[0]);return x.weight?`${x.weight} kg × ${x.reps||0}`:`${x.reps||0} tekrar`}
const GLASS=Object.freeze({
  "Incline Barbell Bench Press":Object.freeze({text:"Tutuşu omuz genişliğinden biraz fazla ayarla; dirsekleri hafif önde tut. Omzunu zorlayan iniş derinliğini zorlama.",adapted:false}),
  "Dumbbell Bench Press":Object.freeze({text:"Kürek kemiklerini geride tut; dirseklerini tamamen yana açmadan kontrollü indir.",adapted:true}),
  "Pull-Up":Object.freeze({text:"Göğsünü bara doğru yükseltmeyi düşün; çekişi yalnızca kollarınla yapma.",adapted:false}),
  "Seated Cable Row":Object.freeze({text:"Çekişi ellerin yerine dirseklerinle başlat. Tutacağı göbeğinin biraz üzerine, alt kaburgalara doğru çek; göğsünü açık tut.",adapted:false}),
  "Reverse Pec Deck":Object.freeze({text:"Makine güvenli bir üst kavrama sunuyorsa göz hizasına yakın daha yüksek kavramayı dene. Uygun değilse normal tutacakları kullan.",adapted:false}),
  "Incline Dumbbell Curl":Object.freeze({text:"Göğsünü açık ve omuzlarını aşağıda tut. Curl sırasında trapezlerini yukarı silkme.",adapted:false}),
  "Machine Shoulder Press":Object.freeze({text:"Dirseklerini omuz hattının hafif önünde tut. İniş derinliğini makinenin yapısına ve omuz rahatlığına göre ayarla.",adapted:false}),
  "Preacher Curl":Object.freeze({text:"Üst kollarını ve dirseklerini pede sabitle; ağırlığı kaldırırken pedden ayrılmalarına izin verme.",adapted:false}),
  "Cable Lateral Raise":Object.freeze({text:"Hareketi öne savurma; yana doğru aç. Çekişi elinle değil, dirseğinle yönlendir. Omuzlarını silkme.",adapted:true}),
  "Leg Press":Object.freeze({text:"Ayaklarını yaklaşık omuz genişliğinde aç, uçlarını hafif dışa yönlendir. Belini pedden kaldırma; dizleri sertçe kilitleme.",adapted:false}),
  "Leg Extension":Object.freeze({text:"Ayak uçlarını kendine doğru çek; rahatsa hafif dışa yönlendir. Hareketi sallanmadan tamamla.",adapted:false}),
  "Seated Leg Curl":Object.freeze({text:"Dizlerini makinenin dönme ekseniyle hizala. Üst ped bacaklarını sabitlesin; kalçanı oynatma.",adapted:false}),
  "Standing Calf Raise":Object.freeze({text:"Ayak tarakların platformda destekli olsun; topukların serbestçe insin. Üstte parmak uçlarına doğru yüksel.",adapted:false}),
  "Seated Calf Raise":Object.freeze({text:"Makine ve pozisyonun uygunsa gövdeni hafif öne eğ. Ayak taraklarını sabitle; topuklara kontrollü hareket alanı bırak.",adapted:false}),
});
window.FT_GLASS_NOTES=GLASS;
window.ftQuickHistory=i=>{const e=rows()[i];if(!e)return;const h=history(e.name,20);document.getElementById('ftQuickHistoryModal')?.remove();const m=document.createElement('div');m.id='ftQuickHistoryModal';m.className='ftiq-modal';m.innerHTML=`<div class="ftiq-sheet"><div class="ftiq-head"><div><h3>${esc(e.name)}</h3><div class="ftiq-mini">Geçmiş antrenmanlar</div></div><button class="secondary small" onclick="ftQuickHistoryModal.remove()">Kapat</button></div><div class="ftiq-list">${h.slice().reverse().map(x=>`<div class="ftiq-row"><b>${esc(x.date)}</b><span>${esc(summary(x.e))}</span><span class="ftiq-mini">En iyi: ${esc(best(x.e))}</span></div>`).join('')||'<div class="ftiq-mini">Henüz kayıt yok.</div>'}</div></div>`;document.body.appendChild(m)};
function addInlineHistory(){document.querySelectorAll('.workout-card').forEach((card,i)=>{if(card.querySelector('.ft-inline-history'))return;const e=rows()[i],h=history(e?.name,2),last=h.at(-1),prev=h.at(-2);const box=document.createElement('div');box.className='ft-inline-history';box.innerHTML=`<div><b>Son:</b> ${esc(last?summary(last.e):'İlk kayıt')}${prev?` <span>• Önceki: ${esc(summary(prev.e))}</span>`:''}</div><div class="ft-inline-history-actions"><button class="secondary small" onclick="ftQuickHistory(${i})">Geçmiş / PR</button><button class="secondary small" onclick="ftIQReplace?.(${i},'${String(e?.name||'').replace(/'/g,"\\'")}')">Değiştir</button></div>`;card.querySelector('.exercise-head')?.insertAdjacentElement('afterend',box)})}
function addGlassNotes(){
 document.querySelectorAll('.workout-card').forEach((card,i)=>{
  const e=rows()[i],spec=GLASS[e?.name],prior=card.querySelector('.ft-glass-note');
  if(!spec){prior?.remove();return}
  const d=prior||document.createElement('details');
  d.className='ft-glass-note';
  if(d.dataset.glassKey!==e.name){
   d.innerHTML=`<summary>${spec.adapted?'Glass • uyarlama':'Glass notu'}</summary><div>${esc(spec.text)}</div>`;
   d.dataset.glassKey=e.name;
  }
  if(!prior){
   const hist=card.querySelector('.ft-inline-history');
   (hist||card.querySelector('.exercise-head'))?.insertAdjacentElement('afterend',d);
  }
 });
}
function compactPicker(){const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>db.program?.[o.value]||db.program?.[o.text]));if(!sel||sel.closest('.ft-workout-compact-picker'))return;const holder=sel.closest('div');if(!holder)return;const wrap=document.createElement('div');wrap.className='ft-workout-compact-picker';wrap.innerHTML='<label>ANTRENMAN</label>';holder.parentNode.insertBefore(wrap,holder);wrap.appendChild(sel);holder.querySelector('.ft-schedule-badge')?.remove();holder.querySelector('label')?.style.setProperty('display','none')}
function miniDate(){const input=document.getElementById('workoutDate');if(!input||document.querySelector('.ft-workout-date-mini'))return;const card=input.closest('.card')||input.parentElement?.parentElement;if(!card)return;card.style.position='relative';const d=document.createElement('div');d.className='ft-workout-date-mini';const dt=input.value?new Date(input.value+'T12:00:00'):new Date();d.textContent=dt.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});d.appendChild(input);card.appendChild(d);const holder=input.parentElement;if(holder&&holder!==d){holder.style.display='none'}}
function markReadiness(){[...document.querySelectorAll('.card')].forEach(c=>{const t=c.textContent||'';if(t.includes('Hazırlık verisi'))c.classList.add('ft-readiness-compact');if(t.includes('Antrenmanı esnek düzenle'))c.classList.add('ft-flex-edit-bottom')})}
function reorder(){const selector=document.querySelector('.form-exercise-selector');const flex=document.querySelector('.ft-flex-edit-bottom');const nav=document.querySelector('.form-exercise-nav');if(selector&&nav&&selector.previousElementSibling!==nav)nav.insertAdjacentElement('afterend',selector);if(flex&&selector)selector.insertAdjacentElement('afterend',flex)}
function enhance(){compactPicker();miniDate();markReadiness();addInlineHistory();addGlassNotes();reorder()}
const base=window.renderWorkout;window.renderWorkout=function(){base();setTimeout(enhance,50)};
setTimeout(enhance,140);
})();
