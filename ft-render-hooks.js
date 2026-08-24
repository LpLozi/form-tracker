/* FT render lifecycle — single authoritative renderWorkout wrapper.
 *
 * Replaces the previous pattern where 9+ separate files each did:
 *   const base = window.renderWorkout;
 *   window.renderWorkout = function(){ base(); setTimeout(ownStuff, N) };
 * (11 nested overrides, ~17 independently-timed setTimeout calls per render.)
 *
 * Other workout-screen files now call registerBeforeWorkoutRender(fn) /
 * registerAfterWorkoutRender(fn) instead of wrapping window.renderWorkout
 * themselves. This file wraps it exactly once and runs every registered
 * hook in a single, predictable, two-pass sequence:
 *   1) before-hooks, in registration order (same as before: state prep
 *      that must happen before the real render, e.g. applying a caught-up
 *      workout day or hydrating an in-progress exercise-swap session)
 *   2) the real render
 *   3) after-hooks, in registration order, once via requestAnimationFrame
 *      (DOM has already been written synchronously by step 2, so hooks can
 *      safely read it as soon as the browser is ready to paint)
 *   4) the same after-hooks run once more after a short delay, as a single
 *      safety net for anything that depends on a layout/async settle
 *      (replaces the old practice of the same file scheduling itself 2-3
 *      times at different arbitrary delays).
 *
 * Each hook function is expected to be idempotent (safe to call twice in a
 * row) — this was already true of essentially every existing hook, since
 * they all guard with `if (document.getElementById(...)) return`-style
 * checks before creating DOM nodes.
 *
 * Must load immediately after workout-plus.js and before every other
 * workout-screen file.
 */
(()=>{'use strict';
  if(window.__ftRenderHooksInstalled)return;
  const beforeHooks=[],afterHooks=[];

  window.registerBeforeWorkoutRender=function(fn){
    if(typeof fn==='function'&&!beforeHooks.includes(fn))beforeHooks.push(fn);
  };
  window.registerAfterWorkoutRender=function(fn){
    if(typeof fn==='function'&&!afterHooks.includes(fn))afterHooks.push(fn);
  };

  const base=window.renderWorkout;
  if(typeof base!=='function'){
    console.warn('ft-render-hooks: window.renderWorkout not defined yet — hooks will not run');
    return;
  }

  let settleTimer=null;
  function runAfterHooks(){
    afterHooks.forEach(fn=>{
      try{fn()}catch(e){console.warn('[ft-render-hooks] after-render hook failed',e)}
    });
  }

  window.renderWorkout=function(...args){
    beforeHooks.forEach(fn=>{
      try{fn()}catch(e){console.warn('[ft-render-hooks] before-render hook failed',e)}
    });
    const out=base.apply(this,args);
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(runAfterHooks);
    else setTimeout(runAfterHooks,0);
    clearTimeout(settleTimer);
    settleTimer=setTimeout(runAfterHooks,260);
    return out;
  };

  window.__ftRenderHooksInstalled=true;
})();
