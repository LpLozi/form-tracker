/* FORM smart feature hotfixes */
(()=>{'use strict';
const CANON={0:'Upper Strength',2:'Lower Strength',4:'Upper Hypertrophy',5:'HYROX Hybrid'};
const CATCH='formCatchupWorkoutV1';
const localKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function catchup(){try{return JSON.parse(localStorage.getItem(CATCH)||'null')}catch{return null}}
function restore(){
 const day=new Date().getDay(),plan=CANON[day]||null;
 if(window.FT_SCHEDULE){if(plan)window.FT_SCHEDULE[day]=plan;else delete window.FT_SCHEDULE[day]}
 window._wk=plan;
 setTimeout(()=>{try{renderWorkout()}catch{}},0);
}
function wrapSave(name){const base=window[name];if(typeof base!=='function'||base.__ftCatchRestore)return;const wrapped=function(...args){const c=catchup(),active=!!c&&c.date===localKey(),n=(typeof db!=='undefined'&&db.workouts)?db.workouts.length:0,out=base.apply(this,args);if(active&&typeof db!=='undefined'&&db.workouts?.length>n)restore();return out};wrapped.__ftCatchRestore=true;window[name]=wrapped;}
wrapSave('saveWorkout');wrapSave('ftSaveHyrox');
})();