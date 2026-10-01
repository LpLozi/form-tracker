/* FORM Smart Training Cards v2.1 — tempo, technique, rest and compact guidance */
(()=>{'use strict';
const VER='2.1.0';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dbx=()=>{try{return db}catch{return window.db||{}}};
const norm=e=>{try{return normalizeExercise(e)}catch{return Array.isArray(e)?{name:e[0],sets:e[1],reps:e[2],rir:e[3]||''}:e||{}}};
const active=()=>((dbx().program||{})[window._wk]||[]).map(norm);
const fallback=e=>{
 const iso=/fly|raise|curl|extension|pushdown|pec deck|leg curl|leg extension|pulldown/i.test(e.name||'');
 return {tempo:e.tempo||(iso?'3-0-1-0':'2-0-X-0'),rest:+e.rest||90,cue:e.cue||'Tam hareket açıklığı • kontrollü negatif • form bozulmadan tekrar.',finish:e.finish||(iso?'Son sette 0–1 RIR kabul; form bozulursa set biter.':'Failure yok; hedef RIR korunur.'),focus:e.focus||'Kaliteli tekrar ve kontrollü progresyon.'};
};
const meta=e=>Object.assign({},fallback(e),e);
const restText=s=>{s=+s||90;return s%60?Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' dk':(s/60)+' dk'};
function tempoParts(code){
 const p=String(code||'2-0-X-0').replace(/×/g,'-').split('-');
 while(p.length<4)p.push('0');
 return p.slice(0,4);
}
function tempoExplain(code){
 const [a,b,c,d]=tempoParts(code);
 const con=String(c).toUpperCase()==='X'?'patlayıcı niyetle, formu bozmadan mümkün olduğunca güçlü kaldır/çek':c+' sn kaldır/çek';
 return [
  '<b>'+esc(code)+'</b>',
  esc(a)+' sn kontrollü indir/uzat',
  esc(b)+' sn uzamış pozisyonda bekle',
  esc(con),
  esc(d)+' sn kısalmış pozisyonda bekle'
 ];
}
function style(){
 if(document.getElementById('ftSmartCardsCss'))return;
 const s=document.createElement('style');s.id='ftSmartCardsCss';s.textContent=`
 .ftsmart-chips{display:flex!important;gap:4px!important;align-items:center!important;flex-wrap:wrap!important;margin-top:4px!important}
 .ftsmart-chip,.ftsmart-tempo{border:1px solid #dfe6ef;background:#f8fafc;color:#475467;border-radius:999px;padding:3px 6px;font-size:8px;font-weight:800;line-height:1.1}
 button.ftsmart-tempo{cursor:pointer;color:#245ba7;background:#f5f9ff}
 .ftsmart-cue{font-size:9px;line-height:1.3;color:#526174;margin:3px 1px 4px;padding:4px 6px;border-left:2px solid #8eb5ef;background:#f8fbff;border-radius:0 7px 7px 0}
 .ftsmart-tech{margin:3px 0 4px;border:1px solid #e7ebf1;border-radius:9px;background:#fff}
 .ftsmart-tech summary{cursor:pointer;list-style:none;padding:5px 7px;font-size:8px;font-weight:850;color:#526174}
 .ftsmart-tech summary::-webkit-details-marker{display:none}.ftsmart-tech summary:after{content:'＋';float:right;color:#7b8798}.ftsmart-tech[open] summary:after{content:'−'}
 .ftsmart-tech-body{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 7px 7px}
 .ftsmart-tech-body>div{background:#f8fafc;border:1px solid #edf1f5;border-radius:8px;padding:6px}
 .ftsmart-tech-body b{display:block;font-size:8px;color:#344054;margin-bottom:2px}.ftsmart-tech-body span{display:block;font-size:8px;line-height:1.35;color:#667085}
 .ftsmart-help{border:1px solid #dbe6f6;background:#f7fbff;color:#245ba7;border-radius:9px;padding:6px 8px;font-size:9px;font-weight:850;white-space:nowrap}
 .ftsmart-modal{position:fixed;inset:0;z-index:260;background:rgba(15,23,42,.48);display:grid;place-items:end center;padding:12px}
 .ftsmart-sheet{width:min(620px,100%);max-height:78vh;overflow:auto;background:#fff;border-radius:20px;padding:15px;box-shadow:0 22px 70px rgba(15,23,42,.22)}
 .ftsmart-sheet-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.ftsmart-sheet h3{margin:0 0 4px;font-size:17px}.ftsmart-sheet p{margin:0;color:#667085;font-size:11px;line-height:1.4}
 .ftsmart-close{border:1px solid #dfe6ef;background:#fff;border-radius:9px;padding:6px 9px;font-weight:800}
 .ftsmart-tempo-list{display:grid;gap:6px;margin-top:12px}.ftsmart-tempo-list div{padding:8px 9px;border:1px solid #e7ebf1;background:#f8fafc;border-radius:10px;font-size:11px;color:#475467}.ftsmart-tempo-list b{color:#172033}
 .ftsmart-legend{margin-top:10px;padding:9px;border-radius:10px;background:#eef6ff;font-size:10px;line-height:1.45;color:#37516f}
 body.ftv3-training .ft-glass-note,body.ftv3-training .form-guide{display:none!important}
 @media(max-width:700px){.ftsmart-tech-body{grid-template-columns:1fr}.ftsmart-help{width:max-content}}
 `;document.head.appendChild(s);
}
function showTempo(code,name){
 document.getElementById('ftSmartTempoModal')?.remove();
 const x=tempoExplain(code),m=document.createElement('div');m.id='ftSmartTempoModal';m.className='ftsmart-modal';
 m.innerHTML=`<div class="ftsmart-sheet" role="dialog" aria-modal="true" aria-label="Tempo rehberi"><div class="ftsmart-sheet-head"><div><h3>Tempo rehberi</h3><p>${name?esc(name)+' • ':''}Sıra her zaman: <b>negatif → esneme beklemesi → pozitif → sıkışma beklemesi</b>.</p></div><button class="ftsmart-close" type="button" data-ftsmart-close>Kapat</button></div><div class="ftsmart-tempo-list"><div>${x[0]} — bu hareketin temposu</div><div><b>1. değer:</b> ${x[1]}</div><div><b>2. değer:</b> ${x[2]}</div><div><b>3. değer:</b> ${x[3]}</div><div><b>4. değer:</b> ${x[4]}</div></div><div class="ftsmart-legend"><b>X ne demek?</b> X saniye değildir. Ağırlığı savurmak değil; formu koruyarak mümkün olduğunca güçlü/hızlı pozitif tekrar demektir.<br><br><b>Örnek:</b> 2-0-X-0 = 2 sn indir, altta bekleme, güçlü kaldır, üstte bekleme.</div></div>`;
 document.body.appendChild(m);
}
function decorateCard(card,e,i){
 e=meta(e);
 const head=card.querySelector('.exercise-head');if(!head)return;
 const line=head.firstElementChild?.querySelector('div');
 if(line){
  line.className='ftsmart-chips';
  line.innerHTML=`<span class="ftsmart-chip">${esc(e.sets)} set • ${esc(e.reps)}</span><span class="ftsmart-chip">RIR ${esc(e.rir||'-')}</span><button class="ftsmart-tempo" type="button" data-ftsmart-tempo="${esc(e.tempo)}" data-ftsmart-name="${esc(e.name)}">Tempo ${esc(e.tempo)}</button><span class="ftsmart-chip">Dinlenme ${esc(restText(e.rest))}</span>`;
 }
 card.querySelector('.ft-glass-note')?.remove();card.querySelector('.form-guide')?.remove();
 let cue=card.querySelector('.ftsmart-cue');
 if(!cue){cue=document.createElement('div');cue.className='ftsmart-cue';head.insertAdjacentElement('afterend',cue)}
 cue.textContent=e.cue;
 let d=card.querySelector('.ftsmart-tech');
 if(!d){d=document.createElement('details');d.className='ftsmart-tech';const a=card.querySelector('.ftv3-strip')||cue;a.insertAdjacentElement('afterend',d)}
 d.innerHTML=`<summary>Teknik / nasıl uygulanacak?</summary><div class="ftsmart-tech-body"><div><b>Amaç</b><span>${esc(e.focus)}</span></div><div><b>Set bitişi</b><span>${esc(e.finish)}</span></div><div><b>Tempo</b><span>${esc(e.tempo)} • Tempo rozetine dokunup açılımını görebilirsin.</span></div><div><b>Progresyon</b><span>Üst tekrar sınırını tüm setlerde hedef RIR ile tamamla → sonraki seansta küçük yük artışı.</span></div></div>`;
}
function topHelp(){
 const box=document.getElementById('f2work');if(!box||box.querySelector('.ftsmart-help'))return;
 const b=document.createElement('button');b.type='button';b.className='ftsmart-help';b.textContent='Tempo rehberi';b.dataset.ftsmartTempo='2-0-X-0';b.dataset.ftsmartName='Genel örnek';box.appendChild(b);
}
function decorate(){
 const rows=active(),cards=[...document.querySelectorAll('.workout-card')];
 if(!cards.length)return;
 cards.slice(0,rows.length).forEach((c,i)=>decorateCard(c,rows[i],i));
 topHelp();
 document.documentElement.dataset.ftSmartCards=VER;
}
document.addEventListener('click',e=>{
 const t=e.target.closest?.('[data-ftsmart-tempo]');if(t){e.preventDefault();showTempo(t.dataset.ftsmartTempo,t.dataset.ftsmartName||'');return}
 if(e.target.closest?.('[data-ftsmart-close]')||e.target.id==='ftSmartTempoModal')document.getElementById('ftSmartTempoModal')?.remove();
},true);
const oldSet=window.setCompleted;
if(typeof oldSet==='function'){
 window.setCompleted=function(name,setNo,el){
  if(!el?.checked)return;
  const e=meta(active().find(x=>x.name===name)||{name});
  if(e.rest&&typeof window.startRest==='function')return window.startRest(+e.rest,name,setNo);
  return oldSet.apply(this,arguments);
 };
}
const base=window.renderWorkout;
if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(decorate,80);setTimeout(decorate,900);setTimeout(decorate,1250);return r};
style();setTimeout(decorate,500);setTimeout(decorate,1300);
window.FT_SMART_TEMPO={version:VER,open:showTempo,explain:tempoExplain};
})();