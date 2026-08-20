/* FORM HYROX day/program selector hotfix */
(()=>{'use strict';
const DAYS=[
  ['Pazar','Upper Strength'],
  ['Salı','Lower Strength'],
  ['Perşembe','Upper Hypertrophy'],
  ['Cuma','HYROX Hybrid']
];
function inject(){
  if(window._wk!=='HYROX Hybrid')return;
  const root=document.getElementById('app')||window.app;
  if(!root||root.querySelector('#ftHyroxDayPicker'))return;
  const first=root.querySelector('.card');
  if(!first)return;
  const box=document.createElement('div');
  box.id='ftHyroxDayPicker';
  box.className='card';
  box.style.padding='10px 12px';
  box.style.marginBottom='10px';
  box.innerHTML=`<div style="display:flex;align-items:center;gap:10px"><label style="margin:0;font-size:11px;font-weight:800;white-space:nowrap">ANTRENMAN GÜNÜ</label><select id="ftHyroxDaySelect" style="margin:0;min-width:0;flex:1;padding:8px 30px 8px 10px;font-size:14px">${DAYS.map(([day,plan])=>`<option value="${plan}" ${window._wk===plan?'selected':''}>${day} • ${plan}</option>`).join('')}</select></div>`;
  first.insertAdjacentElement('beforebegin',box);
  const sel=box.querySelector('#ftHyroxDaySelect');
  sel.addEventListener('change',()=>{window._wk=sel.value;window.renderWorkout?.()});
}
const base=window.renderWorkout;
if(typeof base==='function'){
  window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(inject,0);return r};
}
setTimeout(inject,80);
})();
