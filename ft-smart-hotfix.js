/* FORM smart feature hotfixes */
(()=>{'use strict';
// Previously kept its own hardcoded day->program map ("CANON") as a copy of
// schedule-v2.js's FT_SCHEDULE. The two drifted apart (different weekday
// numbers for the same programs), so post-catch-up navigation could jump to
// a day/plan combination that didn't match the real schedule. schedule-v2.js
// is the single source of truth for the day->program schedule now — this
// file just reads window.FT_SCHEDULE directly instead of duplicating it.
const CATCH='formCatchupWorkoutV1';
const localKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function catchup(){try{return JSON.parse(localStorage.getItem(CATCH)||'null')}catch{return null}}
function restore(){
 const day=new Date().getDay(),plan=(window.FT_SCHEDULE||{})[day]||null;
 window._wk=plan;
 setTimeout(()=>{try{renderWorkout()}catch{}},0);
}
function wrapSave(name){const base=window[name];if(typeof base!=='function'||base.__ftCatchRestore)return;const wrapped=function(...args){const c=catchup(),active=!!c&&c.date===localKey(),n=(typeof db!=='undefined'&&db.workouts)?db.workouts.length:0,out=base.apply(this,args);if(active&&typeof db!=='undefined'&&db.workouts?.length>n)restore();return out};wrapped.__ftCatchRestore=true;window[name]=wrapped;}
wrapSave('saveWorkout');wrapSave('ftSaveHyrox');
})();