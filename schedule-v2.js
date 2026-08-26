/* FORM schedule v3 — scheduled days auto-select, programs remain accessible every day */
(()=>{
const FT_SCHEDULE={0:'Upper A — Göğüs',2:'Lower Strength',4:'Upper B — Sırt',5:'HYROX Hybrid'};
const FT_PROGRAM={
 'Upper A — Göğüs':[
  {name:'Incline Chest Press',sets:3,reps:'6-8',rir:'1-2'},
  {name:'Machine Chest Press',sets:2,reps:'8-10',rir:'1'},
  {name:'Cable Fly / Pec Deck',sets:2,reps:'10-15',rir:'0-1'},
  {name:'Lat Pulldown',sets:2,reps:'8-10',rir:'1-2'},
  {name:'Seated Cable Row',sets:2,reps:'8-10',rir:'1-2'},
  {name:'Lateral Raise',sets:3,reps:'12-20',rir:'0-1'},
  {name:'Triceps Pushdown',sets:2,reps:'10-15',rir:'0-1'},
  {name:'Cable / Biceps Curl',sets:2,reps:'10-15',rir:'0-1'}
 ],
 'Lower Strength':[
  {name:'Back Squat',sets:3,reps:'5-8',rir:'1-2'},
  {name:'Romanian Deadlift',sets:3,reps:'6-10',rir:'1-2'},
  {name:'Leg Press',sets:2,reps:'8-12',rir:'1'},
  {name:'Leg Curl',sets:3,reps:'10-15',rir:'0-1'},
  {name:'Leg Extension',sets:2,reps:'10-15',rir:'0-1'},
  {name:'Calf Raise',sets:3,reps:'10-15',rir:'0-1'},
  {name:'Cable Crunch',sets:2,reps:'10-15',rir:'1'}
 ],
 'Upper B — Sırt':[
  {name:'Chest Supported T-Bar Row',sets:3,reps:'6-10',rir:'1-2'},
  {name:'Neutral / Close Grip Lat Pulldown',sets:3,reps:'8-12',rir:'1'},
  {name:'Seated Cable Row / High Row',sets:2,reps:'10-12',rir:'0-1'},
  {name:'Reverse Pec Deck',sets:2,reps:'12-20',rir:'0-1'},
  {name:'Incline Dumbbell Press',sets:2,reps:'8-10',rir:'1-2'},
  {name:'Cable Fly — Low to High',sets:2,reps:'12-15',rir:'0-1'},
  {name:'Lateral Raise',sets:3,reps:'12-20',rir:'0-1'},
  {name:'Hammer Curl',sets:2,reps:'8-12',rir:'0-1'},
  {name:'Overhead Cable Triceps Extension',sets:2,reps:'10-15',rir:'0-1'}
 ],
 'HYROX Hybrid':[{name:'HYROX Hybrid Circuit',sets:0,reps:'',rir:''}]
};
const DAY_NAMES=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function localDate(){const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function todayWorkout(){return FT_SCHEDULE[new Date().getDay()]||null}
function nextWorkout(){for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()+i);const p=FT_SCHEDULE[d.getDay()];if(p)return{day:DAY_NAMES[d.getDay()],plan:p}}return null}
function applySchedule(){
 db.program=FT_PROGRAM;
 db.settings=db.settings||{};
 db.settings.trainingDays={...FT_SCHEDULE};
 db.settings.scheduleVersion='3.1-preview-bodybuilding';
 if(typeof save==='function')save();
}
applySchedule();

const HYROX_SEGMENTS=[
 ['run1','Koşu','500 m','',''],['ski','SkiErg','500 m','',''],['run2','Koşu','500 m','',''],['push','Sled Push','25 m','kg','120 kg toplam (sled dahil)'],
 ['run3','Koşu','500 m','',''],['pull','Sled Pull','25 m','kg','80 kg toplam (sled dahil)'],['run4','Koşu','500 m','',''],['row','RowErg','500 m','',''],
 ['run5','Koşu','500 m','',''],['carry','Farmer Carry','100 m','kg','2 × 24 kg'],['lunge','Sandbag Walking Lunge','40–50 m','kg','20 kg'],['wall','Wall Ball','30–50 tekrar','kg','6 kg']
];
const HYROX_WEIGHT_PLACEHOLDER={push:'120',pull:'80',carry:'24',lunge:'20',wall:'6'};
function hyroxWeightLabel(key){if(key==='carry')return'Tek el (kg)';if(key==='push'||key==='pull')return'Toplam ağırlık (kg)';return'Ağırlık (kg)'}
function hyroxDraft(){try{return JSON.parse(localStorage.getItem('formHyroxDraft')||'{}')}catch{return {}}}
function saveHyroxDraftField(k,field,v){const d=hyroxDraft();d[k]=d[k]||{};d[k][field]=Number(v)||0;localStorage.setItem('formHyroxDraft',JSON.stringify(d))}
window.ftHyroxField=saveHyroxDraftField;
function hyroxElapsed(){return window._workoutStart?Math.max(0,Math.floor((Date.now()-window._workoutStart)/1000)):0}
function hyroxClock(){const t=hyroxElapsed(),h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')}
function hyroxTick(){clearInterval(window._timerInt);window._timerInt=setInterval(()=>{const e=document.getElementById('workoutTimer');if(e)e.textContent=hyroxClock();else clearInterval(window._timerInt)},1000)}
window.ftStartHyrox=function(){if(!window._workoutStart)window._workoutStart=Date.now();renderWorkout()};
window.ftSaveHyrox=function(){
 const draft=hyroxDraft(),date=localDate(),durationSec=hyroxElapsed();
 const segments=HYROX_SEGMENTS.map(([key,name,target,unit,recommendation])=>({key,name,target,unit,recommendation,seconds:Number(draft[key]?.seconds)||0,weight:Number(draft[key]?.weight)||0}));
 db.workouts.push({date,type:'HYROX Hybrid',durationSec,exercises:[],hyrox:{segments},cardio:null});
 if(typeof save==='function')save();
 localStorage.removeItem('formHyroxDraft');window._workoutStart=null;clearInterval(window._timerInt);
 if(typeof toast==='function')toast('HYROX Hybrid kaydedildi');
 if(typeof render==='function')render();
};
function renderHyrox(){
 const draft=hyroxDraft(),running=!!window._workoutStart;
 app.innerHTML=`<div class="card"><div style="display:flex;justify-content:space-between;gap:14px;align-items:center"><div><div class="muted">${DAY_NAMES[new Date().getDay()]} • HYROX</div><h2 style="margin:4px 0">HYROX Hybrid</h2><div class="muted">1–2. hafta başlangıç bloğu • koşular 500 m • yaklaşık 30–45 dk</div></div><div style="text-align:right"><div class="muted">Süre</div><div id="workoutTimer" class="timer">${running?hyroxClock():'00:00:00'}</div></div></div><button class="primary" style="margin-top:14px;width:100%" onclick="ftStartHyrox()" ${running?'disabled':''}>${running?'Antrenman başladı':'Antrenmanı başlat'}</button></div>
 <div style="margin-top:14px">${HYROX_SEGMENTS.map(([key,name,target,unit,recommendation],i)=>`<div class="workout-card"><div class="exercise-head"><div><strong>${i+1}. ${name}</strong><div class="muted">Hedef: ${target}</div>${recommendation?`<div class="muted" style="margin-top:3px"><b>Tavsiye ağırlık:</b> ${recommendation}</div>`:''}</div><span class="pill">${name==='Koşu'?'Compromised run':'İstasyon'}</span></div><div class="row"><div><label>Süre (sn)</label><input type="number" inputmode="numeric" min="0" value="${draft[key]?.seconds||''}" placeholder="örn. 180" onchange="ftHyroxField('${key}','seconds',this.value)"></div>${unit?`<div><label>${hyroxWeightLabel(key)}</label><input type="number" inputmode="decimal" step="0.5" min="0" value="${draft[key]?.weight||''}" placeholder="${HYROX_WEIGHT_PLACEHOLDER[key]||'kg'}" onchange="ftHyroxField('${key}','weight',this.value)"></div>`:''}</div></div>`).join('')}</div>
 <div class="card"><div class="note"><b>İlk 2 hafta:</b> amaç yarış simülasyonu değil. Tüm bloğu kontrollü biçimde tamamla; koşuya döndüğünde nabzı toparlayabiliyor ol. 2 hafta sonunda tamamlanabilirlik ve sürelerine göre koşu mesafesini artıracağız.</div><button class="primary" style="width:100%;margin-top:12px" onclick="ftSaveHyrox()">Antrenmanı bitir ve kaydet</button></div>`;
 if(running)hyroxTick();
}

const baseRenderWorkout=renderWorkout;
renderWorkout=function(){
 const planned=todayWorkout();
 if(!window._wk)window._wk=planned||Object.keys(FT_PROGRAM)[0];
 const chosen=window._wk;
 if(chosen==='HYROX Hybrid')return renderHyrox();
 baseRenderWorkout();
 const date=document.getElementById('workoutDate');if(date)date.value=localDate();
 const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>FT_PROGRAM[o.value]||FT_PROGRAM[o.text]));
 if(sel){
   sel.disabled=false;sel.style.display='';
   const options=[...sel.options];
   const match=options.find(o=>o.value===chosen||o.text===chosen);if(match)sel.value=match.value;
   const box=sel.closest('div');if(box){
     const lab=box.querySelector('label');if(lab)lab.textContent=planned?'Bugünün programı':'Programı seç';
     box.querySelector('.ft-schedule-badge')?.remove();
     const badge=document.createElement('div');badge.className='note ft-schedule-badge';badge.style.marginTop='4px';
     const n=nextWorkout();
     badge.innerHTML=planned?`<b>${DAY_NAMES[new Date().getDay()]}:</b> ${planned}<br><span class="muted">Planlı program otomatik açıldı; istersen başka programı da seçebilirsin.</span>`:`<b>Bugün planlı antrenman yok.</b><br><span class="muted">Programlar yine açık. İstediğin antrenmanı seçip başlayabilirsin.${n?` Sıradaki planlı gün: ${n.day} • ${n.plan}.`:''}</span>`;
     box.appendChild(badge);
   }
   sel.onchange=()=>{const opt=sel.options[sel.selectedIndex];window._wk=FT_PROGRAM[sel.value]?sel.value:opt.text;renderWorkout()};
 }
};

const baseRenderPanel=renderPanel;
renderPanel=function(){baseRenderPanel();const plan=todayWorkout();document.querySelectorAll('.hero-tag').forEach(e=>e.textContent=plan?`${DAY_NAMES[new Date().getDay()]} • ${plan}`:'Bugün planlı antrenman yok');};

window.FT_SCHEDULE=FT_SCHEDULE;window.FT_PROGRAM=FT_PROGRAM;window.FT_TODAY_WORKOUT=todayWorkout;window.FT_NEXT_WORKOUT=nextWorkout;
})();
