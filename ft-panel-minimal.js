/* FORM panel minimal — concise, professional dashboard */
(()=>{'use strict';
function txt(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim()}
function hideByPhrase(app,rx){[...app.querySelectorAll('.card,section,div')].forEach(el=>{const t=txt(el);if(rx.test(t)){const target=el.classList.contains('card')?el:el.closest('.card')||el;target.classList.add('ftpm-hide')}})}
function apply(){
 if(typeof current!=='undefined'&&current!=='Panel')return;
 const app=document.getElementById('app');if(!app)return;
 app.querySelector('.hero-brand')?.classList.add('ftpm-hide');
 hideByPhrase(app,/^Hızlı işlemler\b/i);
 hideByPhrase(app,/^Günlük alışkanlıklar\b/i);
 hideByPhrase(app,/^Haftalık kalori\b/i);
 const cards=[...app.querySelectorAll('.card')];
 cards.forEach(c=>{const t=txt(c);
   if(/^Kalan\b/i.test(t)||(/Kalan/i.test(t)&&/kcal/i.test(t)&&!/(Bugün kalan|Takvim)/i.test(t)))c.classList.add('ftpm-hide');
   if(/^Kalori\b/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Protein\b/i.test(t)&&!/hedefinde/i.test(t))c.classList.add('ftpm-kpi');
   if(/^Güncel kilo\b/i.test(t))c.classList.add('ftpm-kpi','ftpm-weight');
   if(/\bBUGÜN\b/i.test(t)&&(/Protein hedefinde|Bugünkü antrenman|Toparlanma günü/i.test(t)))c.classList.add('ftpm-today');
   if(/Hazırlık/i.test(t)&&(/20 sn kontrol|Uyku/i.test(t)))c.classList.add('ftpm-readiness');
   if(/Bu haftanın yükü/i.test(t)){c.classList.add('ftpm-weekload');const title=[...c.querySelectorAll('h1,h2,h3,strong,b')].find(x=>/Bu haftanın yükü/i.test(txt(x)));if(title)title.textContent='Bu haftanın yükü'}
 });
 const kpis=[...app.querySelectorAll('.ftpm-kpi:not(.ftpm-hide)')];
 if(kpis.length){const p=kpis[0].parentElement;if(p){p.classList.add('ftpm-kpi-grid');kpis.forEach(k=>{if(k.parentElement===p)k.classList.add('ftpm-kpi-child')})}}
}
function css(){if(document.getElementById('ftPanelMinimalCss'))return;const s=document.createElement('style');s.id='ftPanelMinimalCss';s.textContent=`.ftpm-hide{display:none!important}.ftpm-today{padding:12px 14px!important;margin-bottom:8px!important}.ftpm-today h1,.ftpm-today h2,.ftpm-today .big{font-size:19px!important;line-height:1.15!important;margin-bottom:3px!important}.ftpm-today .muted,.ftpm-today p{font-size:11px!important;line-height:1.35!important}.ftpm-today .pill,.ftpm-today button{margin-top:7px!important;padding:5px 9px!important;font-size:10px!important}.ftpm-kpi-grid{gap:8px!important;margin-top:0!important}.ftpm-kpi-child{padding:11px 12px!important;min-height:0!important;border-radius:13px!important}.ftpm-kpi-child .kpi,.ftpm-kpi-child .big{font-size:20px!important;line-height:1!important}.ftpm-kpi-child .muted,.ftpm-kpi-child small{font-size:10px!important}.ftpm-kpi-child .progress{height:4px!important;margin-top:6px!important}.ftpm-weight{grid-column:1/-1!important}.ftpm-readiness{padding:11px 12px!important;margin-top:8px!important;border-radius:13px!important}.ftpm-readiness h2,.ftpm-readiness h3{font-size:13px!important;margin-bottom:6px!important}.ftpm-readiness label{font-size:9px!important;margin-bottom:2px!important}.ftpm-readiness input,.ftpm-readiness select{padding:6px 7px!important;min-height:34px!important}.ftpm-readiness .note,.ftpm-readiness .muted{font-size:9px!important;line-height:1.3!important}.ftpm-readiness .row{gap:6px!important}.ftpm-weekload{padding:14px!important;border-radius:15px!important;box-shadow:none!important;border:1px solid #dfe6ef!important}.ftpm-weekload h1,.ftpm-weekload h2,.ftpm-weekload h3{font-size:13px!important;text-transform:uppercase!important;letter-spacing:.12em!important;color:#526075!important;margin-bottom:12px!important}.ftpm-weekload .grid,.ftpm-weekload .g2,.ftpm-weekload .g3,.ftpm-weekload .g4{gap:8px!important}.ftpm-weekload .kpi,.ftpm-weekload .big{font-size:21px!important;letter-spacing:-.02em!important}.ftpm-weekload .muted,.ftpm-weekload small,.ftpm-weekload p{font-size:10px!important;line-height:1.3!important;color:#7b8494!important}.ftpm-weekload .card{box-shadow:none!important;background:#fafbfc!important;border-radius:11px!important;padding:10px!important}@media(max-width:600px){#app{gap:9px!important}.ftpm-kpi-grid{grid-template-columns:1fr 1fr!important}.ftpm-weight{grid-column:1/-1!important}.ftpm-readiness .row{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;flex-wrap:nowrap!important}.ftpm-readiness .row>*{min-width:0!important}.ftpm-weekload{padding:12px!important}.ftpm-weekload .g4,.ftpm-weekload .grid{grid-template-columns:1fr 1fr!important}}`;document.head.appendChild(s)}
css();
const old=window.renderPanel;if(typeof old==='function')window.renderPanel=function(...a){const o=old.apply(this,a);setTimeout(apply,20);return o};setTimeout(apply,180);
})();