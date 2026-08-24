/* FORM panel minimal — remove redundant hero, compact daily essentials */
(()=>{'use strict';
function txt(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim()}
function apply(){
 if(typeof current!=='undefined'&&current!=='Panel')return;
 const app=document.getElementById('app');if(!app)return;
 const hero=app.querySelector('.hero-brand');if(hero)hero.classList.add('ftpm-hide');
 const cards=[...app.querySelectorAll('.card')];
 cards.forEach(c=>{const t=txt(c);
   if(/^Kalan\b/i.test(t)||(/Kalan/i.test(t)&&/2[.,]?400\s*kcal/i.test(t)&&!/(Bugün kalan|Takvim)/i.test(t)))c.classList.add('ftpm-hide');
   if(/^Kalori\b/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Protein\b/i.test(t)&&!/hedefinde/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Güncel kilo\b/i.test(t))c.classList.add('ftpm-kpi','ftpm-weight');
   if(/\bBUGÜN\b/i.test(t)&&(/Protein hedefinde|Bugünkü antrenman|Toparlanma günü/i.test(t)))c.classList.add('ftpm-today');
   if(/Hazırlık/i.test(t)&&(/20 sn kontrol|Uyku/i.test(t)))c.classList.add('ftpm-readiness');
 });
 const kpis=[...app.querySelectorAll('.ftpm-kpi:not(.ftpm-hide)')];
 if(kpis.length){const parent=kpis[0].parentElement;if(parent){parent.classList.add('ftpm-kpi-grid');kpis.forEach(k=>{if(k.parentElement===parent)k.classList.add('ftpm-kpi-child')})}}
}
function css(){if(document.getElementById('ftPanelMinimalCss'))return;const s=document.createElement('style');s.id='ftPanelMinimalCss';s.textContent=`.ftpm-hide{display:none!important}.ftpm-today{padding:14px 16px!important;margin-bottom:10px!important}.ftpm-today h1,.ftpm-today h2,.ftpm-today .big{font-size:20px!important;line-height:1.15!important;margin-bottom:4px!important}.ftpm-today .muted,.ftpm-today p{font-size:12px!important;line-height:1.35!important}.ftpm-today .pill,.ftpm-today button{margin-top:8px!important;padding:6px 10px!important;font-size:11px!important}.ftpm-kpi-grid{gap:8px!important;margin-top:0!important}.ftpm-kpi-child{padding:12px 13px!important;min-height:0!important;border-radius:14px!important}.ftpm-kpi-child .kpi,.ftpm-kpi-child .big{font-size:21px!important;line-height:1!important}.ftpm-kpi-child .muted,.ftpm-kpi-child small{font-size:10px!important}.ftpm-kpi-child .progress{height:5px!important;margin-top:7px!important}.ftpm-weight{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr auto!important;align-items:center!important}.ftpm-readiness{padding:12px 14px!important;margin-top:8px!important;border-radius:14px!important}.ftpm-readiness h2,.ftpm-readiness h3{font-size:14px!important;margin-bottom:7px!important}.ftpm-readiness label{font-size:10px!important;margin-bottom:3px!important}.ftpm-readiness input,.ftpm-readiness select{padding:7px 8px!important;min-height:36px!important}.ftpm-readiness .note,.ftpm-readiness .muted{font-size:10px!important;line-height:1.35!important}.ftpm-readiness .row{gap:7px!important}@media(max-width:600px){#app{gap:10px!important}.ftpm-today{padding:12px 14px!important}.ftpm-kpi-grid{grid-template-columns:1fr 1fr!important}.ftpm-weight{grid-column:1/-1!important}.ftpm-readiness{padding:11px 12px!important}.ftpm-readiness .row{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;flex-wrap:nowrap!important}.ftpm-readiness .row>*{min-width:0!important}}`;document.head.appendChild(s)}
css();
const old=window.renderPanel;if(typeof old==='function')window.renderPanel=function(...a){const o=old.apply(this,a);setTimeout(apply,20);return o};setTimeout(apply,180);
})();