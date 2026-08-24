/* FORM workout UI v2.3 — today first, compact and predictable */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const norm=r=>{try{return normalizeExercise(r)}catch{return r||{}}};
function rows(){return (db.program?.[window._wk]||[]).map(norm)}
function history(name,n=8){return (db.workouts||[]).filter(w=>w.exercises?.some(e=>e.name===name)).sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(-n).map(w=>({date:w.date,e:w.exercises.find(e=>e.name===name)}))}
function sets(e){return (e?.setData||[]).filter(x=>x.done||x.weight||x.reps)}
function summary(e){const s=sets(e);if(!s.length)return'—';return s.map(x=>`${x.weight?`${Number(x.weight).toLocaleString('tr-TR',{maximumFractionDigits:1})} kg × `:''}${x.reps||'—'}`).join(' / ')}
function best(e){const s=sets(e);if(!s.length)return'—';const x=s.reduce((a,b)=>((+b.weight||0)*(+b.reps||0)>(+a.weight||0)*(+a.reps||0)?b:a),s[0]);return x.weight?`${x.weight} kg × ${x.reps||0}`:`${x.reps||0} tekrar`}
const GLASS={
'Incline Chest Press':'Kürek kemiklerini sabitle; dirsekleri aşırı açma. Ağırlığı göğsün üst bölümüne kontrollü indir.',
'Lat Pulldown':'Göğsü hafif yukarıda tut; barı ellerle değil dirsekleri aşağı çekerek indir.',
'Machine Chest Press':'Omuzları öne kaçırma. Dirsek hattını göğüste gerilim kalacak açıda koru.',
'Seated Cable Row':'Gövdeyi savurma. Dirsekleri kalçaya doğru sür ve kürek kemiklerini kontrollü kapat.',
'Machine Shoulder Press':'Belden destek alma. Dirsekleri omuz hattının biraz önünde tut ve kontrollü bas.',
'Lateral Raise':'Ağırlığı elden değil dirsekten kaldır. Omzu yukarı silkmeden orta omuzda gerilimi koru.',
'Cable / Biceps Curl':'Dirsekleri sabit tut; omuzu öne taşımadan biceps sıkışmasını tamamla.',
'Triceps Pushdown':'Dirsekleri gövdeye kilitle. Omuz hareketi yerine sadece dirsek açılımına odaklan.',
'Back Squat':'Ayak tabanını zemine sabitle; diz ve kalça birlikte kırılırken gövdeyi dengede tut.',
'Romanian Deadlift':'Dizleri hafif kır; kalçayı geriye sür. Barı bacağa yakın tutup hamstring gerilimini koru.',
'Leg Press':'Belini pedden ayırma. Dizleri kilitlemeden tam ve kontrollü menzil kullan.',
'Leg Curl':'Kalçayı pedden kaldırma. Negatifi yavaşlat ve hamstringi tam kısalt.',
'Calf Raise':'Altta gerçek esneme, üstte tam sıkışma. Sekme yapma.',
'Cable Crunch':'Kalçayı değil göğüs kafesini pelvise yaklaştır; karınla kıvrıl.',
'Incline Dumbbell Press':'Kürek kemiklerini sabitle; dirsekleri yaklaşık 30–45° hatta tut. Dumbbelları göğse doğru kontrollü indir.',
'Neutral / Close Grip Lat Pulldown':'Göğsü hafif yukarıda tut; tutamağı aşağı çekerken dirsekleri ceplere götür.',
'Cable Fly — Low to High':'Dirsek açısını sabit tut; elleri değil üst göğsü birbirine yaklaştırıyormuş gibi sık.',
'Chest Supported Row':'Göğsü pedden ayırma. Dirsekleri geriye sür ve üst noktada kürek kemiklerini sık.',
'Reverse Pec Deck':'Omuzları yukarı kaldırma. Kolları değil arka omuzu geriye açmaya odaklan.',
'Hammer Curl':'Dirsekleri gövde yanında sabit tut. Ön kolu sallamadan brachialis ve biceps gerilimini koru.',
'Overhead Cable Triceps Extension':'Dirsekleri başın yanında sabitle; omuzdan hareket etmeden tam germe ve sıkışma yap.'
};
window.ftQuickHistory=i=>{const e=rows()[i];if(!e)return;const h=history(e.name,20);document.getElementById('ftQuickHistoryModal')?.remove();const m=document.createElement('div');m.id='ftQuickHistoryModal';m.className='ftiq-modal';m.innerHTML=`<div class="ftiq-sheet"><div class="ftiq-head"><div><h3>${esc(e.name)}</h3><div class="ftiq-mini">Geçmiş antrenmanlar</div></div><button class="secondary small" onclick="ftQuickHistoryModal.remove()">Kapat</button></div><div class="ftiq-list">${h.slice().reverse().map(x=>`<div class="ftiq-row"><b>${esc(x.date)}</b><span>${esc(summary(x.e))}</span><span class="ftiq-mini">En iyi: ${esc(best(x.e))}</span></div>`).join('')||'<div class="ftiq-mini">Henüz kayıt yok.</div>'}</div></div>`;document.body.appendChild(m)};
function addInlineHistory(){document.querySelectorAll('.workout-card').forEach((card,i)=>{if(card.querySelector('.ft-inline-history'))return;const e=rows()[i],h=history(e?.name,2),last=h.at(-1),prev=h.at(-2);const box=document.createElement('div');box.className='ft-inline-history';box.innerHTML=`<div><b>Son:</b> ${esc(last?summary(last.e):'İlk kayıt')}${prev?` <span>• Önceki: ${esc(summary(prev.e))}</span>`:''}</div><div class="ft-inline-history-actions"><button class="secondary small" onclick="ftQuickHistory(${i})">Geçmiş / PR</button><button class="secondary small" onclick="ftIQReplace?.(${i},'${String(e?.name||'').replace(/'/g,"\\'")}')">Değiştir</button></div>`;card.querySelector('.exercise-head')?.insertAdjacentElement('afterend',box)})}
function addGlassNotes(){document.querySelectorAll('.workout-card').forEach((card,i)=>{if(card.querySelector('.ft-glass-note'))return;const e=rows()[i],note=GLASS[e?.name];if(!note)return;const d=document.createElement('details');d.className='ft-glass-note';d.innerHTML=`<summary>Glass notu</summary><div>${esc(note)}</div>`;const hist=card.querySelector('.ft-inline-history');(hist||card.querySelector('.exercise-head'))?.insertAdjacentElement('afterend',d)})}
function compactPicker(){const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>db.program?.[o.value]||db.program?.[o.text]));if(!sel||sel.closest('.ft-workout-compact-picker'))return;const holder=sel.closest('div');if(!holder)return;const wrap=document.createElement('div');wrap.className='ft-workout-compact-picker';wrap.innerHTML='<label>ANTRENMAN</label>';holder.parentNode.insertBefore(wrap,holder);wrap.appendChild(sel);holder.querySelector('.ft-schedule-badge')?.remove();holder.querySelector('label')?.style.setProperty('display','none')}
function miniDate(){const input=document.getElementById('workoutDate');if(!input||document.querySelector('.ft-workout-date-mini'))return;const card=input.closest('.card')||input.parentElement?.parentElement;if(!card)return;card.style.position='relative';const d=document.createElement('div');d.className='ft-workout-date-mini';const dt=input.value?new Date(input.value+'T12:00:00'):new Date();d.textContent=dt.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});d.appendChild(input);card.appendChild(d);const holder=input.parentElement;if(holder&&holder!==d){holder.style.display='none'}}
function markReadiness(){[...document.querySelectorAll('.card')].forEach(c=>{const t=c.textContent||'';if(t.includes('Hazırlık verisi'))c.classList.add('ft-readiness-compact');if(t.includes('Antrenmanı esnek düzenle'))c.classList.add('ft-flex-edit-bottom')})}
function reorder(){const selector=document.querySelector('.form-exercise-selector');const flex=document.querySelector('.ft-flex-edit-bottom');const nav=document.querySelector('.form-exercise-nav');if(selector&&nav&&selector.previousElementSibling!==nav)nav.insertAdjacentElement('afterend',selector);if(flex&&selector)selector.insertAdjacentElement('afterend',flex)}
function enhance(){compactPicker();miniDate();markReadiness();addInlineHistory();addGlassNotes();reorder()}
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(enhance);
else{const base=window.renderWorkout;window.renderWorkout=function(){base();setTimeout(enhance,50)}}
setTimeout(enhance,140);
})();
