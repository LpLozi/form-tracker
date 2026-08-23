/* FT Strong-style in-app keypad: no native keyboard, fluid KG -> Reps -> RIR -> next set */
(()=>{'use strict';
let active=null;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function isSetInput(el){return !!el?.matches?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')}
function parse(el){return String(el?.id||'').match(/^(kg|rep|rir)_(\d+)_(\d+)$/)}
function ensurePad(){let p=$('#ftStrongPad');if(p)return p;p=document.createElement('div');p.id='ftStrongPad';p.className='ft-strong-pad';p.innerHTML=`<div class="ft-strong-pad-inner"><div class="ft-strong-grid">${[1,2,3,4,5,6,7,8,9,',',0,'⌫'].map(v=>`<button type="button" data-key="${v}">${v}</button>`).join('')}</div><div class="ft-strong-side"><button type="button" class="ft-strong-close" data-action="close">⌄</button><button type="button" class="ft-strong-next" data-action="next">Next</button></div></div>`;document.body.appendChild(p);p.addEventListener('pointerdown',e=>e.preventDefault());p.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.action==='close'){closePad();return}if(b.dataset.action==='next'){next();return}const k=b.dataset.key;if(k)key(k)});return p}
function label(el){const m=parse(el);if(!m)return'';return m[1]==='kg'?'KG':m[1]==='rep'?'TEKRAR':'RIR'}
function activate(el){if(!isSetInput(el))return;ensurePad();active=el;$$('.ft-strong-active').forEach(x=>x.classList.remove('ft-strong-active'));el.classList.add('ft-strong-active');el.blur();requestAnimationFrame(()=>{ensurePad().classList.add('open');document.body.classList.add('ft-strong-open');const next=$('.ft-strong-next');if(next)next.textContent=parse(el)?.[1]==='rir'?'Seti tamamla':'Next';el.scrollIntoView({block:'center',behavior:'smooth'})})}
function closePad(){ensurePad().classList.remove('open');document.body.classList.remove('ft-strong-open');active?.classList.remove('ft-strong-active');active=null}
function emit(el){el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}
function key(k){if(!active)return;let v=String(active.value||'');if(k==='⌫'){v=v.slice(0,-1)}else if(k===','){if(!v.includes('.')&&!v.includes(','))v+=(v?'': '0')+'.'}else{v+=k}active.value=v;emit(active)}
function nextField(el){const m=parse(el);if(!m)return null;const[,kind,i,j]=m;if(kind==='kg')return document.getElementById(`rep_${i}_${j}`);if(kind==='rep')return document.getElementById(`rir_${i}_${j}`);return null}
function completeSet(el){const m=parse(el);if(!m)return null;const[,kind,i,j]=m;if(kind!=='rir')return null;const cb=document.getElementById(`done_${i}_${j}`);if(cb&&!cb.checked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}))}const same=document.getElementById(`kg_${i}_${Number(j)+1}`);if(same)return same;const nextExercise=document.getElementById(`kg_${Number(i)+1}_0`);return nextExercise||null}
function next(){if(!active)return;if(!String(active.value||'').trim())return;const m=parse(active);let target=nextField(active);if(m?.[1]==='rir')target=completeSet(active);if(target){active.classList.remove('ft-strong-active');active=target;active.classList.add('ft-strong-active');const n=$('.ft-strong-next');if(n)n.textContent=parse(active)?.[1]==='rir'?'Seti tamamla':'Next';active.scrollIntoView({block:'center',behavior:'smooth'});return}closePad()}
function harden(){$$('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]').forEach(el=>{el.setAttribute('readonly','readonly');el.setAttribute('inputmode','none');el.setAttribute('autocomplete','off');el.classList.add('ft-strong-input')})}
document.addEventListener('pointerdown',e=>{const el=e.target.closest?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]');if(!el)return;e.preventDefault();activate(el)},true);
document.addEventListener('focusin',e=>{if(isSetInput(e.target)){e.preventDefault();activate(e.target)}},true);
const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(harden,50);return r};
setTimeout(harden,120);
})();
