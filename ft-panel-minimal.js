/* FORM panel minimal — concise, professional dashboard */
(()=>{'use strict';
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function exactText(root,needle){return [...root.querySelectorAll('*')].find(el=>norm(el.textContent).toLowerCase()===needle.toLowerCase())}
function sectionForTitle(app,title){const h=exactText(app,title);if(!h)return null;let el=h;for(let i=0;i<5&&el&&el!==app;i++,el=el.parentElement){const t=norm(el.textContent);if(t.length<1200&&(el.classList.contains('card')||/card|panel|section|coach|weekly|week/i.test(el.className||'')))return el}return h.parentElement?.parentElement||h.parentElement}
function hideSection(app,title){const s=sectionForTitle(app,title);if(s)s.classList.add('ftpm-hide')}
function apply(){
 if(typeof current!=='undefined'&&current!=='Panel')return;
 const app=document.getElementById('app');if(!app)return;
 app.querySelector('.hero-brand')?.classList.add('ftpm-hide');
 ['Hızlı işlemler','Günlük alışkanlıklar','Haftalık kalori'].forEach(x=>hideSection(app,x));
 const cards=[...app.querySelectorAll('.card')];
 cards.forEach(c=>{const t=norm(c.textContent);
   if(/^Kalan\b/i.test(t)||(/Kalan/i.test(t)&&/kcal/i.test(t)&&!/(Bugün kalan|Takvim)/i.test(t)))c.classList.add('ftpm-hide');
   if(/^Kalori\b/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Protein\b/i.test(t)&&!/hedefinde/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Güncel kilo\b/i.test(t))c.classList.add('ftpm-kpi','ftpm-weight');
   if(/\bBUGÜN\b/i.test(t)&&(/Protein hedefinde|Bugünkü antrenman|Toparlanma günü/i.test(t)))c.classList.add('ftpm-today');
   if(/Hazırlık/i.test(t)&&(/20 sn kontrol|Uyku/i.test(t)))c.classList.add('ftpm-readiness');
 });
 const load=sectionForTitle(app,'Bu haftanın yükü');
 if(load){load.classList.add('ftpm-weekload');const title=exactText(load,'Bu haftanın yükü');if(title)title.classList.add('ftpm-weekload-title');const date=[...load.querySelectorAll('*')].find(el=>/^\d{4}-\d{2}-\d{2}\s*[–-]\s*\d{4}-\d{2}-\d{2}$/.test(norm(el.textContent)));if(date)date.classList.add('ftpm-weekload-date');const badge=[...load.querySelectorAll('*')].find(el=>/\d+\s*antrenman/i.test(norm(el.textContent))&&norm(el.textContent).length<30);if(badge)badge.classList.add('ftpm-weekload-badge');[...load.querySelectorAll('*')].forEach(el=>{const t=norm(el.textContent);if(/^(Set|Ağırlık hacmi|Göğüs|Sırt)$/.test(t))el.classList.add('ftpm-weekload-label');if(/^(\d+(?:[.,]\d+)?(?:\s*kg|\s*set)?|0 set)$/.test(t)&&t.length<18)el.classList.add('ftpm-weekload-value')})}
 const kpis=[...app.querySelectorAll('.ftpm-kpi:not(.ftpm-hide)')];if(kpis.length){const p=kpis[0].parentElement;if(p){p.classList.add('ftpm-kpi-grid');kpis.forEach(k=>{if(k.parentElement===p)k.classList.add('ftpm-kpi-child')})}}
}
function css(){if(document.getElementById('ftPanelMinimalCss'))return;const s=document.createElement('style');s.id='ftPanelMinimalCss';s.textContent=`.ftpm-hide{display:none!important}.ftpm-today{padding:12px 14px!important;margin-bottom:8px!important}.ftpm-today h1,.ftpm-today h2,.ftpm-today .big{font-size:19px!important;line-height:1.15!important;margin-bottom:3px!important}.ftpm-today .muted,.ftpm-today p{font-size:11px!important;line-height:1.35!important}.ftpm-kpi-grid{gap:8px!important;margin-top:0!important}.ftpm-kpi-child{padding:11px 12px!important;min-height:0!important;border-radius:13px!important}.ftpm-kpi-child .kpi,.ftpm-kpi-child .big{font-size:20px!important;line-height:1!important}.ftpm-weight{grid-column:1/-1!important}.ftpm-readiness{padding:11px 12px!important;margin-top:8px!important;border-radius:13px!important}.ftpm-weekload{padding:14px!important;border:1px solid #dfe6ef!important;border-radius:16px!important;box-shadow:none!important;background:#fff!important}.ftpm-weekload-title{font-size:17px!important;line-height:1.1!important;font-weight:850!important;letter-spacing:-.02em!important;color:#172033!important;margin:0!important}.ftpm-weekload-date{display:block!important;margin-top:4px!important;font-size:10px!important;color:#8a93a3!important;font-weight:650!important}.ftpm-weekload-badge{padding:5px 8px!important;border-radius:999px!important;background:#eef4ff!important;color:#315ea8!important;font-size:10px!important;font-weight:800!important}.ftpm-weekload-label{font-size:10px!important;color:#7b8494!important;font-weight:650!important}.ftpm-weekload-value{font-size:19px!important;line-height:1!important;color:#172033!important;font-weight:850!important}.ftpm-weekload [class*='grid'],.ftpm-weekload .g2,.ftpm-weekload .g3,.ftpm-weekload .g4{gap:7px!important}.ftpm-weekload .card,.ftpm-weekload [class*='metric']{padding:10px!important;border-radius:11px!important;background:#f8fafc!important;border:1px solid #e8edf3!important;box-shadow:none!important}@media(max-width:600px){#app{gap:9px!important}.ftpm-kpi-grid{grid-template-columns:1fr 1fr!important}.ftpm-weight{grid-column:1/-1!important}.ftpm-readiness .row{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:6px!important}.ftpm-weekload{padding:12px!important}.ftpm-weekload [class*='grid'],.ftpm-weekload .g4{grid-template-columns:1fr 1fr!important}}`;document.head.appendChild(s)}
css();
let scheduled=false;const run=()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;apply()},30)};
const old=window.renderPanel;if(typeof old==='function')window.renderPanel=function(...a){const o=old.apply(this,a);run();return o};
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});setTimeout(apply,180);
})();