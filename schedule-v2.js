/* FORM schedule v3 — scheduled days auto-select, programs remain accessible every day */
(()=>{
const FT_SCHEDULE={1:'1. Gün — Göğüs / Arka Kol',2:'2. Gün — Sırt / Pazu',4:'3. Gün — Omuz / Karın',5:'4. Gün — Bacak'};
const PROGRAM_VERSION='2026-10-27-exact-four-days-v2';
const ex=(name,sets,reps,group,extra={})=>({name,sets,reps,group,rir:'',source:'exact-screenshots-2026-10-20',...extra});
const FT_PROGRAM={
 '1. Gün — Göğüs / Arka Kol':[
  ex('Barbell Incline Bench Press',4,'15-10-10-8','Göğüs'),
  ex('Dumbbell Bench Press',4,'12-12-10-8','Göğüs'),
  ex('Leverage Decline Chest Press',4,'12-10-10-(5+sb+5)','Göğüs'),
  ex('Cable Low Fly',4,'12-12-10-8','Göğüs'),
  ex('Lever Seated Fly',4,'15-12-10-ds','Göğüs'),
  ex('Standing One Arm Chest Stretch',4,'15s','Göğüs',{stretch:true}),
  ex('Lever Seated Dip',4,'12-12-(5+sb+5)-10','Arka Kol'),
  ex('Cable Pushdown (Bar)',4,'12-12-ds-8','Arka Kol'),
  ex('Cable Overhead Triceps Extension Straight Bar',4,'12-10-10-10','Arka Kol'),
  ex('Overhead Triceps Stretch',4,'15s','Arka Kol',{stretch:true})
 ],
 '2. Gün — Sırt / Pazu':[
  ex('Cable Wide Neutral Grip PullDown',4,'12-(5+sb+5)-12-10','Sırt'),
  ex('Cable Reverse Grip Straight Back Row',4,'12-12-10-(5+sb+5)','Sırt'),
  ex('Dumbbell Bent Over Row with Chest Support',4,'12-12-10-8','Sırt'),
  ex('Cable Palm Rotational Row Back',4,'12-12-10-(5+sb+5)','Sırt'),
  ex('Seated Row',4,'12-(5+sb+5)-12-10','Sırt'),
  ex('Side Lat Stretch Back',4,'15s','Sırt',{stretch:true}),
  ex('Barbell Prone Incline Curl',4,'10-10-10-12','Pazu'),
  ex('Cable Close Grip Curl',4,'12-12-(5+sb+5)-8','Pazu'),
  ex('Hammer Curl (Rope)',4,'12-12-10-ds','Pazu'),
  ex('Elbow Flexor Stretch',4,'15s','Pazu',{stretch:true})
 ],
 '3. Gün — Omuz / Karın':[
  ex('Lever Military Press (plate loaded)',4,'15-12-10-10','Omuz'),
  ex('Dumbbell Arnold Press',4,'12-12-10-10','Omuz'),
  ex('Dumbbell Seated Lateral to Front Raise',4,'15-12-10-8','Omuz'),
  ex('Lever Lateral Raise',4,'12-12-ds-10','Omuz'),
  ex('Dumbbell Seated Bent Over Alternate Rear Delt Fly',4,'12-10-(5+sb+5)-8','Omuz'),
  ex('Bent Arm Shoulder Stretch',4,'15s','Omuz',{stretch:true}),
  ex('Cable Shrug',4,'12-10-8-ds','Omuz'),
  ex('Dumbbell Upright Row',4,'12-10-10-8','Omuz',{note:'*Tekrar sayısı azaldıkça kasılma noktasındaki bekleme süresini arttırıyoruz.',displayReps:'12-10-10-8 *'}),
  ex('Cable Standing Crunch',4,'12','Karın'),
  ex('Seated Leg Rise',4,'12','Karın'),
  ex('Seated 8 Point Leg Crunch',4,'12','Karın'),
  ex('Lying Abdominal Stretch',4,'15s','Karın',{stretch:true})
 ],
 '4. Gün — Bacak':[
  ex('Smith Full Squat',4,'15-12-10-10','Bacak'),
  ex('Hack Squat',4,'10-10-10-12','Bacak'),
  ex('Leg Wide Press',4,'15-12-10-8','Bacak',{supersetWith:'Walking Lunge'}),
  ex('Walking Lunge',4,'12','Bacak',{supersetWith:'Leg Wide Press'}),
  ex('Lever Leg Extension',4,'15-12-(5+sb+5)-8','Bacak'),
  ex('Lever Seated Leg Curl',6,'15-12-(5+sb+5)-12','Bacak',{partialTargets:true}),
  ex('Smith Calf Raise',6,'15-(5+sb+5)-12-10-10-8','Bacak'),
  ex('Standing Quadriceps Stretch',4,'15s','Bacak',{stretch:true}),
  ex('Lying Crossover Knee Pull Up Stretch',4,'15s','Bacak',{stretch:true}),
  ex('Calf Stretch with Hands Against Wall',4,'15s','Bacak',{stretch:true})
 ]
};
const DAY_NAMES=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function localDate(){const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function todayWorkout(){return FT_SCHEDULE[new Date().getDay()]||null}
function nextWorkout(){for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()+i);const p=FT_SCHEDULE[d.getDay()];if(p)return{day:DAY_NAMES[d.getDay()],plan:p}}return null}
function applySchedule(){
 db.settings=db.settings||{};
 db.settings.programArchive=db.settings.programArchive||{};
 if(db.settings.scheduleVersion!==PROGRAM_VERSION){
  // 27 Ekim: Eski kullanıcı programını sakla; geçmiş antrenman kayıtlarını değiştirme.
  const key='beforeErtugExactReapply_2026_10_27';
  if(!db.settings.programArchive[key])db.settings.programArchive[key]={savedAt:new Date().toISOString(),program:JSON.parse(JSON.stringify(db.program||{})),trainingDays:JSON.parse(JSON.stringify(db.settings.trainingDays||{}))};
  db.program=JSON.parse(JSON.stringify(FT_PROGRAM));
  db.settings.trainingDays={...FT_SCHEDULE};
  db.settings.scheduleVersion=PROGRAM_VERSION;
  if(typeof save==='function')save();
 }else{
  db.program=db.program||JSON.parse(JSON.stringify(FT_PROGRAM));
  db.settings.trainingDays=db.settings.trainingDays||{...FT_SCHEDULE};
 }
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
