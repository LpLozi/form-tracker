/* FORM workout selector — single clean row: Upper Strength (Pazar) */
(()=>{'use strict';
const DAYS=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function daysFor(plan){const s=window.FT_SCHEDULE||{};return Object.keys(s).filter(k=>s[k]===plan).map(k=>DAYS[Number(k)]).filter(Boolean)}
function planFromOption(o){const vals=Object.values(window.FT_SCHEDULE||{});if(vals.includes(o?.value))return o.value;return String(o?.textContent||'').replace(/\s*\([^)]*\)\s*$/,'').replace(/^.*?•\s*/,'').trim()}
function enhance(){
 if(typeof current!=='undefined'&&current!=='Antrenman')return;
 const vals=Object.values(window.FT_SCHEDULE||{}),sel=[...document.querySelectorAll('#app select')].find(s=>[...s.options].some(o=>vals.includes(o.value)||vals.includes(planFromOption(o))));
 if(!sel)return;
 [...sel.options].forEach(o=>{const p=planFromOption(o),ds=daysFor(p);if(ds.length)o.textContent=`${p} (${ds.join('/')})`});
 const plan=window._wk||planFromOption(sel.options[sel.selectedIndex]),ds=daysFor(plan);
 let shell=sel.closest('.ft-plan-select-shell');
 if(!shell){shell=document.createElement('div');shell.className='ft-plan-select-shell';sel.parentNode.insertBefore(shell,sel);shell.appendChild(sel);const v=document.createElement('div');v.className='ft-plan-visible';shell.appendChild(v)}
 shell.querySelector('.ft-plan-visible').innerHTML=`<b>${plan}${ds.length?` <span>(${ds.join(' / ')})</span>`:''}</b><i>⌄</i>`;
 const holder=shell.parentElement;holder?.classList.add('ft-plan-holder');holder?.querySelector('.ft-plan-day')?.remove();
 const row=holder?.parentElement;if(row?.classList.contains('row'))row.classList.add('ft-plan-row');
}
function css(){if(document.getElementById('ftWorkoutDayCss'))return;const s=document.createElement('style');s.id='ftWorkoutDayCss';s.textContent=`.ft-plan-row{display:block!important}.ft-plan-holder{display:block!important;width:100%!important;min-width:0!important;max-width:none!important}.ft-plan-select-shell{position:relative!important;width:100%!important;min-width:0!important;height:52px!important}.ft-plan-select-shell select{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;z-index:2!important;cursor:pointer!important}.ft-plan-visible{position:relative!important;width:100%!important;height:52px!important;display:flex!important;align-items:center!important;padding:0 42px 0 13px!important;border:1px solid #dce3ec!important;border-radius:12px!important;background:#fbfcfe!important;overflow:hidden!important}.ft-plan-visible b{display:block!important;min-width:0!important;font-size:15px!important;line-height:1.2!important;color:#172033!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ft-plan-visible b span{font-weight:700!important;color:#667085!important}.ft-plan-visible i{position:absolute!important;right:13px!important;top:50%!important;transform:translateY(-50%)!important;font-style:normal!important;font-size:17px!important;color:#667085!important}@media(max-width:600px){.ft-plan-select-shell,.ft-plan-visible{height:50px!important}.ft-plan-visible b{font-size:14px!important}}`;document.head.appendChild(s)}
css();
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(()=>setTimeout(enhance,0));else{const r=window.renderWorkout;if(r)window.renderWorkout=function(...a){const o=r.apply(this,a);setTimeout(enhance,0);return o}};
document.addEventListener('change',e=>{if(e.target?.closest?.('.ft-plan-select-shell'))setTimeout(enhance,0)},true);setTimeout(enhance,120);
})();