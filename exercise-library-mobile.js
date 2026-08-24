(()=>{'use strict';
function rerenderVisible(){
  const overlay=document.getElementById('ftlibOverlay');
  if(!overlay||!overlay.classList.contains('open')||typeof window.ftLibraryRenderResults!=='function')return;
  window.ftLibraryRenderResults();
  requestAnimationFrame(()=>window.ftLibraryRenderResults());
  setTimeout(()=>window.ftLibraryRenderResults(),80);
}
function install(){
  const overlay=document.getElementById('ftlibOverlay');
  if(!overlay){setTimeout(install,80);return}
  if(overlay.dataset.ftMobileRenderWatch)return;
  overlay.dataset.ftMobileRenderWatch='1';
  new MutationObserver(rerenderVisible).observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']});
  rerenderVisible();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
