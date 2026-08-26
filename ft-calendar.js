/* FORM monthly workout calendar — isolated preview module */
(()=>{
const DAY_NAMES=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
let viewDate=new Date();viewDate.setDate(1);
function key(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function plannedFor(d){return (window.FT_SCHEDULE&&window.FT_SCHEDULE[d.getDay()])||(db?.settings?.trainingDays?.[d.getDay()])||null}
function workoutsFor(k){return (db?.workouts||[]).map((w,i)=>({...w,__idx:i})).filter(w=>w.date===k)}
function parseKey(k){const [y,m,d]=String(k).split('-').map(Number);return new Date(y,m-1,d)}
function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()),shift=(x.getDay()+6)%7;x.setDate(x.getDate()-shift);return x}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function sameType(a,b){return String(a||'').trim()===String(b||'').trim()}

/*
 * Weekly assignment model:
 * A workout is first matched to that week's planned session with the same type.
 * Same-day completion wins; otherwise the nearest day in the same Mon–Sun week wins.
 * Once a planned slot is matched it cannot consume a second workout of the same type;
 * any additional workout remains an explicit extra session.
 */
function weekModel(d){
 const mon=mondayOf(d),sun=addDays(mon,6),from=key(mon),to=key(sun);
 const plans=[];
 for(let i=0;i<7;i++){const date=addDays(mon,i),type=plannedFor(date);if(type)plans.push({date:key(date),type,match:null})}
 const workouts=(db?.workouts||[]).map((w,i)=>({...w,__idx:i})).filter(w=>w.date>=from&&w.date<=to);
 const used=new Set();
 plans.forEach(p=>{
   const candidates=workouts.filter(w=>!used.has(w.__idx)&&sameType(w.type,p.type));
   if(!candidates.length)return;
   candidates.sort((a,b)=>{
     const ae=a.date===p.date?0:1,be=b.date===p.date?0:1;if(ae!==be)return ae-be;
     const pd=parseKey(p.date),ad=parseKey(a.date),bd=parseKey(b.date);
     return Math.abs(ad-pd)-Math.abs(bd-pd)||a.date.localeCompare(b.date);
   });
   p.match=candidates[0];used.add(candidates[0].__idx);
 });
 return{mon,sun,plans,workouts,used};
}
function infoFor(d){
 const k=key(d),model=weekModel(d),plan=model.plans.find(p=>p.date===k)||null;
 const actual=model.workouts.filter(w=>w.date===k);
 const assignedHere=model.plans.filter(p=>p.match?.date===k);
 const extras=actual.filter(w=>!model.used.has(w.__idx));
 return{k,model,plan,actual,assignedHere,extras};
}
function monthCells(){const y=viewDate.getFullYear(),m=viewDate.getMonth(),first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7,cells=[];for(let i=0;i<offset;i++)cells.push(null);for(let n=1;n<=days;n++)cells.push(new Date(y,m,n));while(cells.length%7)cells.push(null);return cells}
function statusFor(d){
 const i=infoFor(d),today=key(new Date());
 if(i.plan?.match)return{cls:'done',text:i.plan.match.date===i.k?'Tamamlandı':`${parseKey(i.plan.match.date).toLocaleDateString('tr-TR',{weekday:'short'})} tamamlandı`};
 if(i.assignedHere.length)return{cls:'done',text:'Plan başka günden tamamlandı'};
 if(i.extras.length)return{cls:'done',text:'Ekstra antrenman'};
 if(i.plan&&i.k<today)return{cls:'missed',text:'Kaçırıldı'};
 if(i.plan)return{cls:'planned',text:'Planlı'};
 return{cls:'rest',text:'Dinlenme'};
}
function details(d){
 const i=infoFor(d),st=statusFor(d);
 let html=`<div class="ftcal-detail-head"><div><b>${d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</b><div class="ftcal-status ${st.cls}">${esc(st.text)}</div></div></div>`;
 if(i.plan){
   html+=`<div class="ftcal-line"><span>Haftalık plan</span><b>${esc(i.plan.type)}</b></div>`;
   if(i.plan.match&&i.plan.match.date!==i.k){const doneDate=parseKey(i.plan.match.date);html+=`<div class="ftcal-line"><span>Tamamlandığı gün</span><b>${doneDate.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</b></div>`}
 }
 if(i.assignedHere.length){
   i.assignedHere.forEach(p=>{if(p.date!==i.k){const plannedDate=parseKey(p.date);html+=`<div class="ftcal-line"><span>Karşıladığı plan</span><b>${plannedDate.toLocaleDateString('tr-TR',{weekday:'long'})} • ${esc(p.type)}</b></div>`}});
 }
 if(i.actual.length)html+=i.actual.map(w=>{const assigned=i.model.plans.find(p=>p.match?.__idx===w.__idx);const tag=assigned?(assigned.date===i.k?'Planlı seans':'Haftalık planı tamamladı'):'Ekstra';return `<div class="ftcal-workout"><div><b>${esc(w.type||'Antrenman')}</b><div class="muted" style="font-size:11px;margin-top:3px">${tag}</div></div>${w.durationSec?`<span>${Math.round(w.durationSec/60)} dk</span>`:''}</div>`}).join('');
 else if(!i.plan?.match)html+=`<div class="muted" style="margin-top:10px">Bu tarihte kayıtlı antrenman yok.</div>`;
 return html;
}
window.ftCalendarPick=function(k){const el=document.getElementById('ftCalendarDetail');if(el)el.innerHTML=details(parseKey(k))};
window.ftCalendarMove=function(delta){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+delta,1);renderCalendar()};
window.ftCalendarToday=function(){viewDate=new Date();viewDate.setDate(1);renderCalendar()};
function displayName(d){const i=infoFor(d);if(i.actual.length)return i.actual[i.actual.length-1].type||'Antrenman';if(i.plan)return i.plan.type;return null}
function renderCalendar(){const today=key(new Date()),cells=monthCells();app.innerHTML=`<div class="card ftcal-card"><div class="ftcal-top"><div><div class="muted">Antrenman geçmişi</div><h2>${viewDate.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</h2></div><div class="ftcal-actions"><button class="secondary small" onclick="ftCalendarMove(-1)">‹</button><button class="secondary small" onclick="ftCalendarToday()">Bugün</button><button class="secondary small" onclick="ftCalendarMove(1)">›</button></div></div><div class="ftcal-week">${DAY_NAMES.map(x=>`<div>${x}</div>`).join('')}</div><div class="ftcal-grid">${cells.map(d=>{if(!d)return'<div class="ftcal-cell empty"></div>';const k=key(d),name=displayName(d),st=statusFor(d);return `<button class="ftcal-cell ${st.cls} ${k===today?'today':''}" onclick="ftCalendarPick('${k}')"><span class="ftcal-day">${d.getDate()}</span>${name?`<span class="ftcal-name">${esc(name)}</span>`:'<span class="ftcal-name muted">—</span>'}<span class="ftcal-dot"></span></button>`}).join('')}</div><div id="ftCalendarDetail" class="ftcal-detail">${details(new Date())}</div><div class="ftcal-legend"><span><i class="done"></i>Tamamlandı</span><span><i class="planned"></i>Planlı</span><span><i class="missed"></i>Kaçırıldı</span></div><div class="muted" style="font-size:11px;margin-top:9px">Planlı seansı haftanın başka bir gününde yaparsan, sistem onu aynı haftadaki ilgili programa otomatik eşler. Aynı programın ikinci kaydı ekstra antrenman olarak kalır.</div></div>`}
if(!pages.includes('Takvim'))pages.splice(Math.max(1,pages.indexOf('Antrenman')+1),0,'Takvim');navIconSvg['Takvim']='<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>';
const baseRender=render;render=function(){if(current==='Takvim'){document.getElementById('todayText').textContent=new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});return renderCalendar()}return baseRender()};
nav();
})();
