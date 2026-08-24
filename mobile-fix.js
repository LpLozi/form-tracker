(()=>{
'use strict';
let lastWidth=0;
function clampNow(){
  const w=Math.round(window.visualViewport?.width||window.innerWidth||document.documentElement.clientWidth);
  if(!w||w>900)return;
  if(w===lastWidth)return; // no-op: avoids forcing a style write/reflow on every DOM mutation
  lastWidth=w;
  document.documentElement.style.setProperty('--form-mobile-vw',w+'px');
  const app=document.getElementById('app'),head=document.querySelector('header>.wrap');
  [document.body,app,head].forEach(el=>{
    if(!el)return;
    el.style.width=w+'px';el.style.maxWidth=w+'px';el.style.minWidth='0';
  });
  document.documentElement.scrollLeft=0;
  document.body.scrollLeft=0;
}

// Coalesce bursts of DOM mutations (a single workout-screen render can touch
// the DOM dozens of times) into at most one clamp() per animation frame,
// instead of running it synchronously for every mutation batch.
let queued=false;
function clamp(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;clampNow()});
}

clampNow();
window.addEventListener('resize',clamp,{passive:true});
window.visualViewport?.addEventListener('resize',clamp,{passive:true});
new MutationObserver(clamp).observe(document.body,{childList:true,subtree:true});
})();
