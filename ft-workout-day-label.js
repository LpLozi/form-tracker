/* FORM workout selector day labels + full-name mobile width */
(()=>{'use strict';
const DAYS=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
function daysFor(plan){const s=window.FT_SCHEDULE||{};return Object.keys(s).filter(k=>s[k]===plan).map(k=>DAYS[Number(k)]).filter(Boolean)}
function enhance(){
  if(typeof current!=='undefined'&&current!=='Antrenman')return;
  const selects=[...document.querySelectorAll('#app select')];
  const sel=selects.find(s=>[...s.options].some(o=>Object.values(window.FT_SCHEDULE||{}).includes(o.value)||Object.values(window.FT_SCHEDULE||{}).includes(o.textContent.trim())));
  if(!sel)return;
  const field=sel.closest('div'); if(!field)return;
  field.classList.add('ft-plan-field');
  const row=field.parentElement; if(row?.classList.contains('row'))row.classList.add('ft-plan-row');
  [...sel.options].forEach(o=>{
    const plan=(window.FT_SCHEDULE&&Object.values(window.FT_SCHEDULE).includes(o.value))?o.value:o.textContent.replace(/^.*?•\s*/,'').trim();
    const ds=daysFor(plan); if(ds.length)o.textContent=`${ds.join('/')} • ${plan}`;
  });
  const selectedPlan=window._wk||sel.value||sel.options[sel.selectedIndex]?.textContent?.replace(/^.*?•\s*/,'').trim();
  const ds=daysFor(selectedPlan);
  let tag=field.querySelector('.ft-plan-day');
  if(!tag){tag=document.createElement('div');tag.className='ft-plan-day';field.appendChild(tag)}
  tag.innerHTML=ds.length?`<span>Önerilen gün</span><b>${ds.join(' / ')}</b>`:`<span>Önerilen gün</span><b>Serbest seçim</b>`;
}
function css(){if(document.getElementById('ftWorkoutDayCss'))return;const s=document.createElement('style');s.id='ftWorkoutDayCss';s.textContent=`.ft-plan-row{display:grid!important;grid-template-columns:minmax(0,3.6fr) minmax(96px,.75fr)!important;gap:8px!important;align-items:end!important}.ft-plan-field{min-width:0!important;width:100%!important}.ft-plan-field select{display:block!important;width:100%!important;min-width:0!important;font-weight:800!important;font-size:14px!important;padding-left:10px!important;padding-right:28px!important;white-space:nowrap!important}.ft-plan-day{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;padding:7px 9px;border-radius:10px;background:#f4f7fb;border:1px solid #e1e7ef;font-size:11px}.ft-plan-day span{color:#7b8494}.ft-plan-day b{color:#25324a;font-size:12px}@media(max-width:600px){.ft-plan-row{grid-template-columns:minmax(0,3.9fr) minmax(88px,.72fr)!important;gap:7px!important}.ft-plan-field select{font-size:13px!important;padding-left:8px!important;padding-right:24px!important}.ft-plan-day{padding:6px 7px;font-size:10px}.ft-plan-day b{font-size:11px}}`;document.head.appendChild(s)}
css();
if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(()=>setTimeout(enhance,0));else{const r=window.renderWorkout;if(r)window.renderWorkout=function(...a){const o=r.apply(this,a);setTimeout(enhance,0);return o}};
document.addEventListener('change',e=>{if(e.target?.matches?.('#app select'))setTimeout(enhance,0)},true);
setTimeout(enhance,120);
})();