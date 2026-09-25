/* FORM 2.0 preflight — preserve current local configuration before schedule migration */
(()=>{'use strict';
try{
 const d=typeof db!=='undefined'?db:window.db;if(!d)return;
 d.settings=d.settings||{};d.settings.programArchive=d.settings.programArchive||{};
 if(!d.settings.programArchive.preForm2){
  const snapshot={savedAt:new Date().toISOString(),program:JSON.parse(JSON.stringify(d.program||{})),trainingDays:JSON.parse(JSON.stringify(d.settings.trainingDays||{}))};
  d.settings.programArchive.preForm2=snapshot;
  try{if(!localStorage.getItem('formDB_backup_pre_form2'))localStorage.setItem('formDB_backup_pre_form2',JSON.stringify(d))}catch{}
  if(typeof save==='function')save();
 }
}catch(e){console.warn('FORM 2.0 preflight',e)}
})();