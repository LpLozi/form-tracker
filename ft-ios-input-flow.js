/* FT iOS native Done/Next set-entry flow */
(()=>{'use strict';
let lastPagePointer=0;
function isSetInput(el){return !!el?.matches?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')}
function parse(el){return String(el?.id||'').match(/^(kg|rep|rir)_(\d+)_(\d+)$/)}
function nextInput(el){const m=parse(el);if(!m)return null;const[,kind,i,j]=m;const id=kind==='kg'?`rep_${i}_${j}`:kind==='rep'?`rir_${i}_${j}`:`kg_${i}_${Number(j)+1}`;return document.getElementById(id)}
function normalize(){document.querySelectorAll('.ft-input-confirm').forEach(btn=>btn.remove());document.querySelectorAll('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]').forEach(el=>{el.setAttribute('inputmode','decimal');el.setAttribute('enterkeyhint','next');el.setAttribute('autocomplete','off');el.closest('td')?.classList.add('ft-native-next-cell')})}
function completeSet(el){const m=parse(el);if(!m||m[1]!=='rir')return false;const[,kind,i,j]=m,cb=document.getElementById(`done_${i}_${j}`);if(cb&&!cb.checked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}))}return true}
function advance(el){if(!isSetInput(el)||!String(el.value||'').trim())return;normalize();const m=parse(el);if(!m)return;if(m[1]==='rir')completeSet(el);const n=nextInput(el);if(n){requestAnimationFrame(()=>n.focus({preventScroll:true}));return}if(m[1]==='rir'){const ni=Number(m[2])+1;const first=document.getElementById(`kg_${ni}_0`);if(first)requestAnimationFrame(()=>first.focus({preventScroll:true}))}}
// Any tap inside the page means the user intentionally chose another target; do not hijack that blur.
document.addEventListener('pointerdown',()=>{lastPagePointer=Date.now()},true);
document.addEventListener('touchstart',()=>{lastPagePointer=Date.now()},{capture:true,passive:true});
// iOS keyboard's black ✓/Done dismisses the field without a page pointer event. Treat that blur as Next.
document.addEventListener('focusout',e=>{const el=e.target;if(!isSetInput(el)||!String(el.value||'').trim())return;if(Date.now()-lastPagePointer<350)return;setTimeout(()=>{if(!isSetInput(document.activeElement))advance(el)},0)},true);
// Hardware keyboards / browsers that surface Enter/Next.
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&isSetInput(e.target)){e.preventDefault();advance(e.target)}},true);
document.addEventListener('focusin',e=>{if(isSetInput(e.target))normalize()},true);
const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(normalize,80);return r};
const add=window.addExtraSet;if(typeof add==='function')window.addExtraSet=function(){const r=add.apply(this,arguments);setTimeout(normalize,0);return r};
setTimeout(normalize,160);
})();
