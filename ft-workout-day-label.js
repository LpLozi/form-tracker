/* FORM workout selector — guaranteed full plan name + recommended day */
(()=>{'use strict';
const DAYS=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function daysFor(plan){const s=window.FT_SCHEDULE||{};return Object.keys(s).filter(k=>s[k]===plan).map(k=>DAYS[Number(k)]).filter(Boolean)}
function planFromOption(o){const values=Object.values(window.FT_SCHEDULE||{});if(values.includes(o?.value))return o.value;return String(o?.textContent||'').replace(/^.*?•\s*/,'').trim()}
function enhance(){
 if(typeof current!=='undefined'&&current!=='Antrenman')return;
 const values=Object.values(window.FT_SCHEDULE||{}),sel=[...document.querySelectorAll('#app select')].find(s=>[...s.options].some(o=>values.includes(o.value)||values.includes(planFromOption(o))));
 if(!sel)return;
 [...sel.options].forEach(o=>{const p=planFromOption(o),ds=daysFor(p);if(ds.length)o.textContent=`${ds.join('/')} • ${p}`});
 const plan=window._wk||planFromOption(sel.options[sel.selectedIndex]);
 let shell=sel.closest('.ft-plan-select-shell');
 if(!shell){shell=document.createElement('div');shell.className='ft-plan-select-shell';sel.parentNode.insertBefore(shell,sel);shell.appendChild(sel);const t=document.createElement('div');t.className='ft-plan-visible';shell.appendChild(t)}
 shell.querySelector('.ft-plan-visible').innerHTML=`<span>ANTRENMAN</span><b>${plan}</b><i>⌄</i>`;
 const holder=shell.parentElement;holder?.classList.add('ft-plan-holder');
 let day=holder?.querySelector('.ft-plan-day');if(holder&&!day){day=document.createElement('div');day.className='ft-plan-day';holder.appendChild(day)}
 const ds=daysFor(plan);if(day)day.innerHTML=`<span>Önerilen gün</span><b>${ds.length?ds.join(' / '):'Serbest'}</b>`;
 const row=holder?.parentElement;if(row?.classList.contains('row'))row.classList.add('ft-plan-row');
}
function css(){if(document.getElementById('ftWorkoutDayCss'))return;const s=document.createElement('style');s.id='ftWorkoutDayCss';s.textContent=`.ft-plan-row{display:block!important}.ft-plan-holder{width:100%!important;min-width:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) 118px!important;gap:8px!important;align-items:stretch!important}.ft-plan-select-shell{position:relative!important;min-width:0!important;height:58px!important}.ft-plan-select-shell select{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;z-index:2!important;cursor:pointer!important}.ft-plan-visible{height:58px!important;display:grid!important;grid-template-columns:1fr auto!important;grid-template-rows:auto auto!important;align-content:center!important;column-gap:8px!important;padding:8px 34px 8px 12px!important;border:1px solid #dce3ec!important;border-radius:12px!important;background:#fbfcfe!important;overflow:hidden!important}.ft-plan-visible span{grid-column:1!important;font-size:9px!important;font-weight:900!important;letter-spacing:.12em!important;color:#8a93a3!important}.ft-plan-visible b{grid-column:1!important;display:block!important;font-size:15px!important;line-height:1.15!important;color:#172033!important;white-space:normal!important;overflow:visible!important}.ft-plan-visible i{position:absolute!important;right:12px!important;top:50%!important;transform:translateY(-50%)!important;font-style:normal!important;font-size:17px!important;color:#667085!important}.ft-plan-day{height:58px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;gap:2px!important;margin:0!important;padding:8px 10px!important;border-radius:12px!important;background:#f4f7fb!important;border:1px solid #e1e7ef!important}.ft-plan-day span{font-size:10px!important;color:#7b8494!important}.ft-plan-day b{font-size:13px!important;color:#25324a!important}@media(max-width:600px){.ft-plan-holder{grid-template-columns:minmax(0,1fr) 104px!important}.ft-plan-visible b{font-size:14px!important}.ft-plan-day{padding:7px 8px!important}.ft-plan-day b{font-size:12px!important}}`;document.head.appendChild(s)}
css();
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(()=>setTimeout(enhance,0));else{const r=window.renderWorkout;if(r)window.renderWorkout=function(...a){const o=r.apply(this,a);setTimeout(enhance,0);return o}};
document.addEventListener('change',e=>{if(e.target?.closest?.('.ft-plan-select-shell'))setTimeout(enhance,0)},true);setTimeout(enhance,120);
})();