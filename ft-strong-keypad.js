/* FT set-entry controller (single authoritative owner of kg_/rep_/rir_ inputs)
 *
 * Owns, exclusively:
 *   - readonly / inputmode on the KG, Reps, RIR inputs (no native keyboard —
 *     Strong-style in-app numeric keypad instead)
 *   - focus/advance between fields
 *   - the KG -> Next -> Reps -> Next -> RIR -> "Seti tamamla" -> next set's
 *     (blank) KG field flow
 *
 * Previously this behavior was split across four separate files that each
 * attached their own document-level focus/keydown/change listeners and each
 * set conflicting `inputmode`/`readonly` attributes on the same inputs
 * (ft-strong-keypad.js, ft-workout-ux-fix.js, ft-training-v3.js, and an
 * orphaned/unused ft-ios-input-flow.js). That produced the keyboard
 * open/close flicker and made the "next KG field starts blank" rule fragile.
 * All of that has been consolidated into this one module; the other files
 * no longer touch these inputs' value, focus, or input-mode attributes.
 */
(()=>{'use strict';
let active=null;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function isSetInput(el){return !!el?.matches?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]')}
function parse(el){return String(el?.id||'').match(/^(kg|rep|rir)_(\d+)_(\d+)$/)}

function ensurePad(){
  let p=$('#ftStrongPad');if(p)return p;
  p=document.createElement('div');p.id='ftStrongPad';p.className='ft-strong-pad';
  p.innerHTML=`<div class="ft-strong-pad-inner"><div class="ft-strong-grid">${[1,2,3,4,5,6,7,8,9,',',0,'⌫'].map(v=>`<button type="button" data-key="${v}">${v}</button>`).join('')}</div><div class="ft-strong-side"><button type="button" class="ft-strong-close" data-action="close">⌄</button><button type="button" class="ft-strong-next" data-action="next">Next</button></div></div>`;
  document.body.appendChild(p);
  p.addEventListener('pointerdown',e=>e.preventDefault());
  p.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.action==='close'){closePad();return}if(b.dataset.action==='next'){next();return}const k=b.dataset.key;if(k)key(k)});
  return p;
}

function setNextLabel(){const n=$('.ft-strong-next');if(n)n.textContent=parse(active)?.[1]==='rir'?'Seti tamamla':'Next'}

function activate(el){
  if(!isSetInput(el))return;
  ensurePad();
  active=el;
  $$('.ft-strong-active').forEach(x=>x.classList.remove('ft-strong-active'));
  el.classList.add('ft-strong-active');
  el.blur();
  requestAnimationFrame(()=>{
    ensurePad().classList.add('open');
    document.body.classList.add('ft-strong-open');
    setNextLabel();
    el.scrollIntoView({block:'center',behavior:'smooth'});
  });
}

function closePad(){
  ensurePad().classList.remove('open');
  document.body.classList.remove('ft-strong-open');
  active?.classList.remove('ft-strong-active');
  active=null;
}

function emit(el){el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}

function key(k){
  if(!active)return;
  let v=String(active.value||'');
  if(k==='⌫')v=v.slice(0,-1);
  else if(k===','){if(!v.includes('.')&&!v.includes(','))v+=(v?'':'0')+'.'}
  else v+=k;
  active.value=v;emit(active);
}

function nextField(el){
  const m=parse(el);if(!m)return null;
  const[,kind,i,j]=m;
  if(kind==='kg')return document.getElementById(`rep_${i}_${j}`);
  if(kind==='rep')return document.getElementById(`rir_${i}_${j}`);
  return null;
}

// Completing the RIR field: mark the set done, then move to the NEXT set's
// KG field (same exercise, or the next exercise's first set) and make sure
// that field starts BLANK — no value is ever copied forward from the set
// that was just completed.
function completeSet(el){
  const m=parse(el);if(!m)return null;
  const[,kind,i,j]=m;if(kind!=='rir')return null;
  const same=document.getElementById(`kg_${i}_${Number(j)+1}`),
        nextExercise=document.getElementById(`kg_${Number(i)+1}_0`),
        target=same||nextExercise||null;
  const cb=document.getElementById(`done_${i}_${j}`);
  if(cb&&!cb.checked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}))}
  if(target){target.value='';emit(target)}
  return target;
}

function next(){
  if(!active)return;
  if(!String(active.value||'').trim())return;
  const m=parse(active);
  let target=nextField(active);
  if(m?.[1]==='rir')target=completeSet(active);
  if(target){
    active.classList.remove('ft-strong-active');
    active=target;
    active.classList.add('ft-strong-active');
    setNextLabel();
    active.scrollIntoView({block:'center',behavior:'smooth'});
    return;
  }
  closePad();
}

function harden(){
  $$('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]').forEach(el=>{
    el.setAttribute('readonly','readonly');
    el.setAttribute('inputmode','none');
    el.setAttribute('autocomplete','off');
    el.classList.add('ft-strong-input');
  });
  // If a full re-render happened while the pad was open and the active
  // field no longer exists (e.g. user switched workout day mid-entry),
  // close the pad instead of holding a stale reference.
  if(active&&!document.body.contains(active))closePad();
}

document.addEventListener('pointerdown',e=>{
  const el=e.target.closest?.('input[id^="kg_"],input[id^="rep_"],input[id^="rir_"]');
  if(!el)return;
  e.preventDefault();
  activate(el);
},true);
document.addEventListener('focusin',e=>{
  if(isSetInput(e.target)){e.preventDefault();activate(e.target)}
},true);
// Hardware/external-keyboard fallback (readonly blocks the on-screen native
// keyboard, but an external keyboard can still send Enter to a focused field).
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&isSetInput(e.target)){e.preventDefault();next()}
},true);

if(window.registerAfterWorkoutRender)window.registerAfterWorkoutRender(harden);
else{const base=window.renderWorkout;if(typeof base==='function')window.renderWorkout=function(){const r=base.apply(this,arguments);setTimeout(harden,50);return r}}

// Harden any set rows added dynamically via the "+ Set" button, whichever
// implementation of it is wired up (app-base.html's addExtraSet, or
// workout-plus.js's formAddSet).
['addExtraSet','formAddSet'].forEach(name=>{
  const orig=window[name];
  if(typeof orig==='function'&&!orig.__ftHardenWrapped){
    const wrapped=function(...args){const r=orig.apply(this,args);setTimeout(harden,0);return r};
    wrapped.__ftHardenWrapped=true;
    window[name]=wrapped;
  }
});

setTimeout(harden,120);
})();
