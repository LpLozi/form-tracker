/* ONUR FORM schedule — source: Hyrox Odaklı PPL Antrenman Programı */
(()=>{
const FT_SCHEDULE={1:'Gün 1 — Push',2:'Gün 2 — Pull',3:'Gün 3 — Legs',4:'HYROX Hybrid',5:'Gün 5 — Full Body Engine'};
const FT_PROGRAM={
 'Gün 1 — Push':[
  {name:'Bench Press',sets:5,reps:'5',rir:'',programNote:'Ana kuvvet hareketi'},
  {name:'Overhead Press',sets:4,reps:'6',rir:''},
  {name:'Incline Dumbbell Press',sets:3,reps:'10',rir:''},
  {name:'Dips',sets:3,reps:'10-12',rir:''},
  {name:'Lateral Raise',sets:3,reps:'15',rir:''},
  {name:'Triceps Pushdown',sets:3,reps:'12',rir:''},
  {name:'SkiErg',sets:1,reps:'10 dk',rir:'',programNote:'Bitiş • Orta tempo • Hyrox ekipmanına adaptasyon'}
 ],
 'Gün 2 — Pull':[
  {name:'Deadlift',sets:5,reps:'5',rir:'',programNote:'Ana kuvvet hareketi'},
  {name:'Pull-up (ağırlıklı)',sets:4,reps:'6-8',rir:''},
  {name:'Barbell Row',sets:4,reps:'8',rir:''},
  {name:'Lat Pulldown',sets:3,reps:'12',rir:''},
  {name:'Face Pull',sets:3,reps:'15',rir:'',programNote:'Omuz sağlığı'},
  {name:'Farmers Carry',sets:3,reps:'40 m',rir:'',programNote:'Hyrox istasyonu'},
  {name:'Rowing',sets:1,reps:'500 m',rir:'',programNote:'Bitiş • Max effort'}
 ],
 'Gün 3 — Legs':[
  {name:'Back Squat',sets:5,reps:'5',rir:'',programNote:'Ana kuvvet hareketi'},
  {name:'Romanian Deadlift',sets:4,reps:'8',rir:''},
  {name:'Walking Lunges',sets:3,reps:'20 adım',rir:'',programNote:'Hyrox istasyonuna direkt transfer'},
  {name:'Bulgarian Split Squat',sets:3,reps:'10/bacak',rir:''},
  {name:'Wall Balls',sets:3,reps:'20',rir:'',programNote:'Hyrox istasyonu'},
  {name:'Calf Raise',sets:3,reps:'15',rir:''},
  {name:'SkiErg / Row',sets:1,reps:'1000 m',rir:'',programNote:'Bitiş'}
 ],
 'HYROX Hybrid':[{name:'HYROX Hybrid Circuit',sets:0,reps:'',rir:''}],
 'Gün 5 — Full Body Engine':[
  {name:'Sandbag Lunges',sets:4,reps:'20 m',rir:''},
  {name:'Wall Balls',sets:4,reps:'15',rir:''},
  {name:'Farmers Carry',sets:4,reps:'50 m',rir:''},
  {name:'Sled Push/Pull',sets:4,reps:'25 m',rir:''},
  {name:'Koşu',sets:5,reps:'400 m',rir:'',programNote:'2 dk dinlenme • Hız/tempo çalışması'},
  {name:'Plank + Hanging Leg Raise',sets:3,reps:'',rir:'',programNote:'Core'}
 ]
};
const PLAN_LABELS={
 'Gün 1 — Push':'Gün 1 — Push (Kuvvet Odaklı)',
 'Gün 2 — Pull':'Gün 2 — Pull (Kuvvet Odaklı)',
 'Gün 3 — Legs':'Gün 3 — Legs (Kuvvet + Hyrox Transfer)',
 'HYROX Hybrid':'Gün 4 — Hyrox Simülasyon / Conditioning',
 'Gün 5 — Full Body Engine':'Gün 5 — Full Body Engine + Hyrox İstasyonları'
};
const DAY_NAMES=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function localDate(){const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function todayWorkout(){return FT_SCHEDULE[new Date().getDay()]||null}
function applySchedule(){
 db.program=FT_PROGRAM;
 db.settings=db.settings||{};
 db.settings.trainingDays={...FT_SCHEDULE};
 db.settings.scheduleVersion='onur-1.0';
 if(typeof save==='function')save();
}
applySchedule();

function restScreen(){
 const next=[];for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()+i);const p=FT_SCHEDULE[d.getDay()];if(p){next.push({day:DAY_NAMES[d.getDay()],plan:p});break}}
 app.innerHTML=`<div class="card" style="text-align:center;padding:28px"><div class="muted" style="font-weight:800;letter-spacing:.08em">BUGÜN</div><h2 style="margin:8px 0">Dinlenme / toparlanma günü</h2><p class="muted">Bugün planlı antrenman yok. Aktif dinlenme, yürüyüş ve hafif mobilite uygundur.</p>${next.length?`<div class="note" style="margin-top:16px;text-align:left"><b>Sıradaki:</b> ${next[0].day} • ${PLAN_LABELS[next[0].plan]||next[0].plan}</div>`:''}</div>`;
}

const HYROX_SEGMENTS=[
 ['run1','Koşu','1 km','',1000],
 ['ski','SkiErg','1000 m','',1000],
 ['run2','Koşu','1 km','',1000],
 ['push','Sled Push','50 m','kg',50],
 ['run3','Koşu','1 km','',1000],
 ['pull','Sled Pull','50 m','kg',50],
 ['run4','Koşu','1 km','',1000],
 ['burpee','Burpee Broad Jumps','80 m','',80],
 ['run5','Koşu','1 km','',1000],
 ['row','Rowing','1000 m','',1000]
];
function hyroxWeightLabel(key){if(key==='push'||key==='pull')return'Ağırlık (kg)';return'Ağırlık (kg)'}
function hyroxDraft(){try{return JSON.parse(localStorage.getItem('formHyroxDraft')||'{}')}catch{return {}}}
function saveHyroxDraftField(k,field,v){const d=hyroxDraft();d[k]=d[k]||{};d[k][field]=Number(v)||0;localStorage.setItem('formHyroxDraft',JSON.stringify(d))}
window.ftHyroxField=saveHyroxDraftField;
function hyroxElapsed(){return window._workoutStart?Math.max(0,Math.floor((Date.now()-window._workoutStart)/1000)):0}
function hyroxClock(){const t=hyroxElapsed(),h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')}
function hyroxTick(){clearInterval(window._timerInt);window._timerInt=setInterval(()=>{const e=document.getElementById('workoutTimer');if(e)e.textContent=hyroxClock();else clearInterval(window._timerInt)},1000)}
window.ftStartHyrox=function(){if(!window._workoutStart)window._workoutStart=Date.now();renderWorkout()};
window.ftSaveHyrox=function(){
 const draft=hyroxDraft(),date=localDate(),durationSec=hyroxElapsed();
 const segments=HYROX_SEGMENTS.map(([key,name,target,unit,distanceM])=>({key,name,target,unit,distanceM,seconds:Number(draft[key]?.seconds)||0,weight:Number(draft[key]?.weight)||0}));
 db.workouts.push({date,type:'HYROX Hybrid',displayType:PLAN_LABELS['HYROX Hybrid'],durationSec,exercises:[],hyrox:{segments},cardio:null});
 if(typeof save==='function')save();
 localStorage.removeItem('formHyroxDraft');window._workoutStart=null;clearInterval(window._timerInt);
 if(typeof toast==='function')toast('HYROX simülasyonu kaydedildi');
 if(typeof render==='function')render();
};
function renderHyrox(){
 const draft=hyroxDraft(),running=!!window._workoutStart;
 app.innerHTML=`<div class="card"><div style="display:flex;justify-content:space-between;gap:14px;align-items:center"><div><div class="muted">${DAY_NAMES[new Date().getDay()]} • Bugünün antrenmanı</div><h2 style="margin:4px 0">${PLAN_LABELS['HYROX Hybrid']}</h2><div class="muted">Compromised running formatı • her 1 km koşu arasına bir istasyon</div></div><div style="text-align:right"><div class="muted">Süre</div><div id="workoutTimer" class="timer">${running?hyroxClock():'00:00:00'}</div></div></div><button class="primary" style="margin-top:14px;width:100%" onclick="ftStartHyrox()" ${running?'disabled':''}>${running?'Antrenman başladı':'Antrenmanı başlat'}</button></div>
 <div style="margin-top:14px">${HYROX_SEGMENTS.map(([key,name,target,unit],i)=>`<div class="workout-card"><div class="exercise-head"><div><strong>${i+1}. ${name}</strong><div class="muted">Hedef: ${target}</div></div><span class="pill">${name==='Koşu'?'Compromised run':'İstasyon'}</span></div><div class="row"><div><label>Süre (sn)</label><input type="number" inputmode="numeric" min="0" value="${draft[key]?.seconds||''}" placeholder="sn" onchange="ftHyroxField('${key}','seconds',this.value)"></div>${unit?`<div><label>${hyroxWeightLabel(key)}</label><input type="number" inputmode="decimal" step="0.5" min="0" value="${draft[key]?.weight||''}" placeholder="kg" onchange="ftHyroxField('${key}','weight',this.value)"></div>`:''}</div></div>`).join('')}</div>
 <div class="card"><div class="note"><b>Program notu:</b> İleri seviye için tam mesafede (yarım Hyrox simülasyonu), tempo kontrollü ama race-pace’e yakın.</div><button class="primary" style="width:100%;margin-top:12px" onclick="ftSaveHyrox()">Antrenmanı bitir ve kaydet</button></div>`;
 if(running)hyroxTick();
}

function decorateStandardWorkout(planned){
 const label=PLAN_LABELS[planned]||planned;
 const cards=[...document.querySelectorAll('.workout-card')];
 const rows=FT_PROGRAM[planned]||[];
 cards.slice(0,rows.length).forEach((card,i)=>{
  const n=rows[i]?.programNote;if(!n||card.querySelector('.onur-program-note'))return;
  const head=card.querySelector('.exercise-head');if(head)head.insertAdjacentHTML('afterend',`<div class="note onur-program-note" style="margin:0 0 10px">${n}</div>`);
 });
 const top=[...document.querySelectorAll('h2')].find(x=>x.textContent?.includes(planned));if(top)top.textContent=label;
}

const baseRenderWorkout=renderWorkout;
renderWorkout=function(){
 const planned=todayWorkout();
 if(!planned){window._wk=null;return restScreen()}
 window._wk=planned;
 if(planned==='HYROX Hybrid')return renderHyrox();
 baseRenderWorkout();
 const date=document.getElementById('workoutDate');if(date)date.value=localDate();
 const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.value===planned||o.text===planned));
 if(sel){sel.value=planned;sel.disabled=true;const box=sel.closest('div');if(box){const lab=box.querySelector('label');if(lab)lab.textContent='Bugünün antrenmanı';sel.style.display='none';const badge=document.createElement('div');badge.className='note';badge.style.marginTop='4px';badge.innerHTML=`<b>${DAY_NAMES[new Date().getDay()]}:</b> ${PLAN_LABELS[planned]||planned}`;box.appendChild(badge)}}
 decorateStandardWorkout(planned);
};

const baseRenderPanel=renderPanel;
renderPanel=function(){
 baseRenderPanel();
 const planned=todayWorkout();
 setTimeout(()=>{
  const buttons=[...document.querySelectorAll('button')].filter(b=>b.textContent.trim().includes('Antrenmana başla'));
  buttons.forEach(b=>{if(planned){b.textContent=`${PLAN_LABELS[planned]||planned} antrenmanını aç`;b.disabled=false}else{b.textContent='Bugün dinlenme günü';b.disabled=true}});
 },0);
};

window.FT_SCHEDULE=FT_SCHEDULE;
window.ftTodayWorkout=todayWorkout;
window.FT_ONUR_PLAN_LABELS=PLAN_LABELS;
if(typeof render==='function')render();
})();
