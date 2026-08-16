/* ONUR FORM — HYROX 1 km koşu pace düzeltmesi */
(()=>{
function fmtPace(sec){if(!Number.isFinite(sec)||sec<=0)return'—';let m=Math.floor(sec/60),s=Math.round(sec%60);if(s===60){m++;s=0}return `${m}:${String(s).padStart(2,'0')}/km`}
function fixHyroxPace(){
 const h=(db.workouts||[]).filter(w=>w.type==='HYROX Hybrid'&&w.hyrox?.segments).sort((a,b)=>a.date.localeCompare(b.date));
 const l=h.at(-1);if(!l)return;
 const runs=l.hyrox.segments.filter(s=>s.name==='Koşu'&&s.seconds);
 if(!runs.length)return;
 const sec=runs.reduce((a,b)=>a+(+b.seconds||0),0),meters=runs.reduce((a,b)=>a+(+b.distanceM||1000),0);
 const pace=meters?sec/(meters/1000):0;
 const card=[...document.querySelectorAll('.ftiq')].find(x=>x.querySelector('h3')?.textContent?.trim()==='HYROX performansı');if(!card)return;
 const stat=[...card.querySelectorAll('.ftiq-stat')].find(x=>x.querySelector('.ftiq-mini')?.textContent?.trim()==='Ort. koşu');
 const b=stat?.querySelector('b');if(b)b.textContent=fmtPace(pace);
}
const base=window.renderPanel;window.renderPanel=function(...a){const o=base.apply(this,a);setTimeout(fixHyroxPace,70);return o};
setTimeout(fixHyroxPace,150);
})();
