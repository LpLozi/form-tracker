(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function activeCategory(){const b=document.querySelector('#ftlibChips button.active');return (b?.textContent||'Tümü').trim()}
function matchesCategory(e,c){return c==='Tümü'||e.category===c||(c==='Kol'&&(e.category==='Biceps'||e.category==='Triceps'))}
let rendering=false;
function forceRender(){
  if(rendering)return;
  const overlay=document.getElementById('ftlibOverlay'),host=document.getElementById('ftlibResults');
  const lib=Array.isArray(window.FT_EXERCISE_LIBRARY)?window.FT_EXERCISE_LIBRARY:[];
  if(!overlay||!host||!overlay.classList.contains('open')||!lib.length)return;
  rendering=true;
  try{
    const q=norm(document.getElementById('ftlibSearch')?.value||''),cat=activeCategory();
    const rows=lib.filter(e=>matchesCategory(e,cat)&&(!q||norm([e.name,e.category,e.equipment,e.primary,e.secondary,e.aliases].join(' ')).includes(q))).slice(0,80);
    host.innerHTML=rows.length?rows.map(e=>`<article class="ftlib-result"><button type="button" class="ftlib-pick" data-ft-mobile-pick="${esc(e.name)}"><span><b>${esc(e.name)}</b><small>${esc(e.category)} • ${esc(e.equipment)} • ${esc(e.primary)}</small></span><strong>Seç</strong></button><details><summary>Form ve yükleme rehberi</summary><div class="ftlib-guide"><p><b>Doğru form:</b> ${esc(e.form)}</p><p><b>Dikkat:</b> ${esc(e.caution)}</p><p><b>Yükleme:</b> ${esc(e.load)}</p><p><b>Varsayılan:</b> ${e.sets} set • ${esc(e.reps)} • RIR ${esc(e.rir)}</p></div></details></article>`).join(''):`<div class="ftlib-empty"><b>Sonuç bulunamadı.</b><span>Farklı hareket, kas grubu veya ekipman ara.</span></div>`;
  }finally{rendering=false}
}
function renderBurst(){forceRender();requestAnimationFrame(forceRender);setTimeout(forceRender,40);setTimeout(forceRender,120);setTimeout(forceRender,300)}
function install(){
  const overlay=document.getElementById('ftlibOverlay');
  if(!overlay){setTimeout(install,60);return}
  if(overlay.dataset.ftMobileRenderWatch)return;
  overlay.dataset.ftMobileRenderWatch='2';
  new MutationObserver(()=>{if(overlay.classList.contains('open'))renderBurst()}).observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']});
  document.addEventListener('input',e=>{if(e.target?.id==='ftlibSearch')setTimeout(forceRender,0)},true);
  document.addEventListener('click',e=>{
    const pick=e.target?.closest?.('[data-ft-mobile-pick]');
    if(pick){e.preventDefault();e.stopPropagation();window.ftLibraryPick?.(pick.dataset.ftMobilePick);return}
    const chip=e.target?.closest?.('#ftlibChips button');
    if(chip)setTimeout(renderBurst,0);
  },true);
  const results=document.getElementById('ftlibResults');
  if(results)new MutationObserver(()=>{if(overlay.classList.contains('open')&&!rendering&&!results.querySelector('.ftlib-result'))setTimeout(forceRender,0)}).observe(results,{childList:true});
  renderBurst();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();