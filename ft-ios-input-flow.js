/* FT iOS continuous set-entry flow */
(()=>{'use strict';
function isSetInput(el){return !!el?.matches?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')}
function nextInput(el){const m=String(el?.id||'').match(/^(kg|rep|rir)_(\d+)_(\d+)$/);if(!m)return null;const[,kind,i,j]=m;const id=kind==='kg'?`rep_${i}_${j}`:kind==='rep'?`rir_${i}_${j}`:`kg_${i}_${Number(j)+1}`;return document.getElementById(id)}
function normalize(){document.querySelectorAll('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]').forEach(el=>{el.setAttribute('inputmode','decimal');el.setAttribute('enterkeyhint','next');el.setAttribute('autocomplete','off')})}
function advance(el){if(!isSetInput(el)||!String(el.value||'').trim())return;const n=nextInput(el);if(!n)return;normalize();n.focus({preventScroll:true})}
// Capture before button handlers so the currently-open iOS keyboard never loses focus.
document.addEventListener('pointerdown',e=>{const btn=e.target?.closest?.('.ft-input-confirm');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();const src=document.getElementById(btn.dataset.for||'');advance(src)},true);
document.addEventListener('touchstart',e=>{const btn=e.target?.closest?.('.ft-input-confirm');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();const src=document.getElementById(btn.dataset.for||'');advance(src)},{capture:true,passive:false});
document.addEventListener('click',e=>{if(e.target?.closest?.('.ft-input-confirm')){e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('focusin',e=>{if(isSetInput(e.target))normalize()},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&isSetInput(e.target)){e.preventDefault();advance(e.target)}},true);
const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(normalize,80);return r};
setTimeout(normalize,180);
})();
