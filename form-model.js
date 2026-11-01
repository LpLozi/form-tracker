/* FORM 3: pure data rules, also exercised by node:test. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.FormModel=api;})(typeof window==='object'?window:this,function(){
'use strict';
const VERSION='3.1.0',PLAN='balanced-ulpp-2026-11';
const clone=x=>JSON.parse(JSON.stringify(x));
const number=x=>x===null||x===undefined||String(x).trim()===''?null:(Number.isFinite(Number(String(x).replace(',','.')))?Number(String(x).replace(',','.')):null);
const day=(d=new Date())=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);return ['year','month','day'].map(k=>p.find(x=>x.type===k).value).join('-')};
const shift=(s,n)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const weekday=s=>new Date(s+'T12:00:00Z').getUTCDay();
const week=s=>shift(s,-((weekday(s)+6)%7));
const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
const ex=(id,name,tr,group,pattern,equipment,how,secondary=[],bodyweight=false)=>({id,name,tr,group,pattern,equipment,how,secondary,bodyweight});
const catalog=[
 ex('machine-chest','Machine Chest Press','Makinede yatay göğüs press','Göğüs','horizontal-push','Göğüs press makinesi','Koltuğu tutacaklar göğüs hizasına gelecek şekilde ayarla. Sırtı destekten ayırmadan it, kontrollü dön.',['Ön omuz','Arka kol']),
 ex('supported-row','Chest-Supported Row','Göğüs destekli sırt çekişi','Sırt','horizontal-pull','Göğüs destekli row makinesi','Göğsünü desteğe yerleştir. Boynu nötr tutarak dirseklerini geriye çek. Gövdeyi sallama.',['Pazu','Arka omuz']),
 ex('neutral-pulldown','Neutral Grip Lat Pulldown','Nötr tutuş üstten çekiş','Sırt','vertical-pull','Kablo istasyonu ve nötr tutacak','Avuçlar birbirine baksın. Tutacağı üst göğse doğru çek, başı öne uzatma.',['Pazu']),
 ex('cable-lateral','Cable Lateral Raise','Kabloda yana omuz açış','Yan omuz','lateral','Kablo istasyonu','Makarayı aşağı ayarla. Dirseği hafif bükerek kolu kontrollü yana kaldır; omzu kulağa çekme.'),
 ex('ez-curl','EZ Bar Curl','EZ bar ile pazu','Pazu','curl','EZ bar','Dirsekleri gövde yanında tut. Gövdeyi sallamadan kaldır ve kontrollü indir.'),
 ex('rope-pushdown','Rope Triceps Pushdown','İple arka kol itiş','Arka kol','extension','Üst makara ve ip','Dirsekler gövde yanında sabit. İpi aşağı it, omuz ve boynu kasarak hareketi tamamlama.'),
 ex('reverse-crunch','Reverse Crunch','Ters mekik','Karın','core','Mat veya düz sehpa','Sırtüstü yat. Dizleri gövdeye yaklaştırırken leğen kemiğini kontrollü kaldır; bacakları savurma.',[],true),
 ex('leg-press','Leg Press','Makinede bacak press','Ön bacak','knee','Leg press makinesi','Bel ve kalçayı destekten ayırmadan dizlerini bük. Kontrol edebildiğin açıklıkta it; dizleri sert kilitleme.',['Kalça']),
 ex('rdl','Romanian Deadlift','Romen deadlift','Arka bacak','hinge','Barbell veya dambıl','Dizleri hafif bük, kalçayı geriye gönder. Ağırlığı bacaklara yakın tut. Boyun nötr; açıklığı teknik ve belirtilere göre sınırla.',['Kalça']),
 ex('seated-curl','Seated Leg Curl','Oturarak arka bacak','Arka bacak','knee-flexion','Seated leg curl makinesi','Makine eksenini dizle hizala, üst pedi sabitle. Topukları aşağı ve geriye çek; kalçayı kaldırma.'),
 ex('leg-extension','Leg Extension','Ön bacak açış','Ön bacak','knee-extension','Leg extension makinesi','Dizini makine eksenine hizala. Bacağı kontrollü aç, dönüşte ağırlığı bırakma.'),
 ex('calf-press','Leg Press Calf Raise','Leg press üzerinde baldır','Baldır','calf','Emniyetli leg press makinesi','Ayak önünü platforma güvenle yerleştir. Dizleri sert kilitlemeden ayak bileğinden yükselip alçal. Emniyet ayarlarını kontrol et.'),
 ex('incline-db','Incline Dumbbell Press','Eğimli dambıl göğüs press','Göğüs','incline-push','Dambıl ve 20–30° sehpa','Kürek kemiklerini sehpa üzerinde sabitle. Dambılları kontrollü indirip it.',['Ön omuz','Arka kol']),
 ex('shoulder-machine','Machine Shoulder Press','Sırt destekli omuz press','Ön omuz','vertical-push','Omuz press makinesi','Sırtını desteğe yerleştir, boynu nötr tut. Belini aşırı kavislendirmeden kontrollü it.',['Arka kol','Yan omuz']),
 ex('cable-fly','Cable Fly','Kabloda göğüs açış','Göğüs','fly','Çift kablo istasyonu','Dirsekleri hafif bükülü tut. Kolları göğüs önünde birleştir, dönüşü kontrollü yap.'),
 ex('overhead-triceps','Overhead Cable Triceps Extension','Baş üstü kabloda arka kol','Arka kol','extension','Kablo ve ip','Üst kolları sabit tutarak dirsekleri aç. Boyun ve kola yayılan belirtiler olursa hareketi durdur.'),
 ex('reverse-pec','Reverse Pec Deck','Makinede arka omuz','Arka omuz','rear-delt','Pec deck makinesi','Göğsünü desteğe yerleştir. Kolları yana ve geriye aç, omuzları yükseltme.'),
 ex('hammer','Dumbbell Hammer Curl','Dambılla çekiç tutuş pazu','Pazu','curl','Dambıl','Avuçları birbirine bakacak şekilde tut. Dirsekleri sabitle, sallanmadan kaldır.'),
 ex('cable-curl','Cable Curl','Kabloda pazu','Pazu','curl','Alt makara','Dirsekleri gövde yanında tut. Barı kontrollü kaldır ve indir.'),
 ex('db-flat','Dumbbell Bench Press','Dambılla düz göğüs press','Göğüs','horizontal-push','Dambıl ve düz sehpa','Sırt ve kürek kemikleri sehpa üzerinde sabit; ağırlığı kontrollü indirip it.',['Ön omuz','Arka kol']),
 ex('cable-row','Seated Cable Row','Oturarak kabloda sırt çekiş','Sırt','horizontal-pull','Alt makara','Gövdeyi sallamadan dirsekleri geriye çek. Boynu nötr tut.',['Pazu','Arka omuz']),
 ex('wide-pulldown','Lat Pulldown','Üstten sırt çekişi','Sırt','vertical-pull','Üst makara','Barı ensene değil göğsüne doğru çek; gövdeyi geriye savurma.',['Pazu']),
 ex('db-lateral','Dumbbell Lateral Raise','Dambılla yana omuz açış','Yan omuz','lateral','Dambıl','Kontrollü yana kaldır; boynu gevşek tut ve ağırlığı savurma.'),
 ex('lying-curl','Lying Leg Curl','Yatarak arka bacak','Arka bacak','knee-flexion','Leg curl makinesi','Kalça destek üzerinde sabitken dizleri bük; ağırlığı kontrollü bırak.'),
 ex('pec-deck','Pec Deck','Makinede göğüs açış','Göğüs','fly','Pec deck','Sırt destek üzerinde, dirsekler kontrollü; kolları göğüs önünde birleştir.')
];
const get=id=>catalog.find(e=>e.id===id||e.name===id);
const row=(id,sets,reps,rir='1–2',rest=105)=>({...get(id),sets,reps,rir,rest,increment:2.5});
function program(){return {
 Upper:[row('machine-chest',4,'6–10','2',150),row('supported-row',4,'8–12','2',150),row('neutral-pulldown',3,'8–12','2',150),row('cable-lateral',3,'12–20'),row('ez-curl',3,'10–15'),row('rope-pushdown',3,'10–15'),row('reverse-crunch',2,'10–20','2',75)],
 Lower:[row('leg-press',4,'8–12','2',180),row('rdl',3,'8–10','2–3',180),row('seated-curl',4,'10–15'),row('leg-extension',4,'10–15'),row('calf-press',5,'10–20')],
 Push:[row('incline-db',4,'8–12','2',150),row('shoulder-machine',2,'8–12','2',150),row('cable-fly',4,'10–15'),row('cable-lateral',3,'12–20'),row('overhead-triceps',3,'10–15'),row('rope-pushdown',2,'10–15')],
 Pull:[row('neutral-pulldown',4,'8–12','2',150),row('supported-row',3,'8–12','2',150),row('reverse-pec',4,'12–20'),row('hammer',3,'10–15'),row('cable-curl',2,'10–15'),row('reverse-crunch',2,'10–20','2',75)]};}
function normalizeExercise(e){if(Array.isArray(e))e={name:e[0],sets:e[1],reps:e[2],rir:e[3]||'2'};return {...(get(e.id)||get(e.name)||{}),...e};}
function migrate(input,foods=[],legacy={},date=day()){
 const d=clone(input||{});d.profile=d.profile||{name:'Hüseyin',height:181};d.targets=d.targets||{kcal:2400,protein:195,carb:220,fat:82,fiber:30,water:4};
 for(const k of ['workouts','measurements','photos','foods'])if(!Array.isArray(d[k]))d[k]=[];
 for(const k of ['meals','habits','settings'])if(!d[k]||typeof d[k]!=='object'||Array.isArray(d[k]))d[k]={};
 foods.forEach(f=>{if(!d.foods.some(x=>x.name===f.name))d.foods.push(clone(f))});
 if(!d.form3){
  const old=clone(d.program||{}),schedule=clone(d.settings.trainingDays||{});
  d.form3={migratedAt:new Date().toISOString(),planId:PLAN,planStart:date,legacy:clone(legacy),draft:null,equipment:{},mealPlans:{},nutritionComplete:{},habits:[],favoriteMeals:[],trash:[],lastExport:null,history:[{id:'legacy-'+Date.now(),name:'Önceki program',effectiveFrom:d.profile.startDate||date,program:old,schedule},{id:PLAN,name:'Dengeli Upper / Lower / Push / Pull',effectiveFrom:date,program:program(),schedule:{1:'Upper',2:'Lower',4:'Push',5:'Pull'}}]};
  try{d.form3.favoriteMeals=JSON.parse(legacy.formFavoriteMealsV1||'[]')}catch{}
  d.program=program();d.settings.trainingDays={1:'Upper',2:'Lower',4:'Push',5:'Pull'};
 }
 if(d.form3.nutritionPlanId!=='ertug-2026-10-28'){
  d.form3.nutritionTargetHistory=d.form3.nutritionTargetHistory||[];
  d.form3.nutritionTargetHistory.push({changedAt:new Date().toISOString(),previous:clone(d.targets),source:'28 Ekim 2026 Ertuğ planı için kaydedilen günlük toplamlar'});
  d.targets={...d.targets,kcal:2258.56,protein:172.21,carb:277.87,fat:62.19,fiber:42.06};
  d.form3.nutritionPlanId='ertug-2026-10-28';
 }
 d.version=VERSION;return d;
}
function validBackup(d){if(d?.form3){const f=d.form3;if(!['history','habits','favoriteMeals','trash'].every(k=>Array.isArray(f[k]))||!['equipment','mealPlans','nutritionComplete'].every(k=>f[k]&&typeof f[k]==='object'&&!Array.isArray(f[k]))||!f.history.every(h=>h&&validDay(h.effectiveFrom)&&h.schedule&&h.program&&Object.values(h.program).every(Array.isArray))||!d.program||!Object.values(d.program).every(Array.isArray)||f.draft&&(!Array.isArray(f.draft.exercises)||!f.draft.exercises.length||!f.draft.exercises.every(e=>Array.isArray(e.setData))))return false;}return !!d&&typeof d==='object'&&!Array.isArray(d)&&Array.isArray(d.workouts)&&Array.isArray(d.foods)&&Array.isArray(d.measurements)&&d.meals&&typeof d.meals==='object'&&!Array.isArray(d.meals)&&d.foods.every(f=>f&&typeof f.name==='string')&&d.workouts.every(w=>w&&validDay(w.date)&&Array.isArray(w.exercises||[]));}
function planAt(d,date){const versions=d.form3?.history||[];const h=versions.filter(h=>h.effectiveFrom<=date).at(-1);return h?{name:h.schedule[weekday(date)]||null,program:h.program,id:h.id}:{name:null,program:{}};}
function workingSets(e){return (e.setData||[]).filter(s=>s.done&&s.setType!=='warmup'&&s.setType!=='Isınma'&&number(s.reps)>0);}
function history(d,e){return d.workouts.filter(w=>(w.exercises||[]).some(x=>x.name===e.name&&(x.equipmentKey||'')===(e.equipmentKey||'')&&workingSets(x).length)).slice().sort((a,b)=>a.date.localeCompare(b.date)||String(a.id||'').localeCompare(String(b.id||'')));}
function advice(d,e){
 const last=history(d,e).at(-1),sets=workingSets(last?.exercises.find(x=>x.name===e.name&&(x.equipmentKey||'')===(e.equipmentKey||''))||{});
 const range=String(e.reps||'').match(/\d+/g)?.map(Number)||[8,12],hi=range[1]||range[0];
 if(!sets.length)return {kind:'İlk kayıt',text:'Tekniği ve hedef RIR’i koruyarak başlangıç ağırlığını belirle.'};
 const weights=sets.map(s=>number(s.weight)),same=weights.every(x=>x===weights[0]),complete=sets.length>=e.sets;
 const target=Number(String(e.rir).match(/\d+/)?.[0]||1),effort=sets.every(s=>number(s.rir)!==null&&number(s.rir)>=target);
 if(complete&&same&&sets.every(s=>number(s.reps)>=hi)&&effort&&weights[0]>0&&number(e.increment)>0)return {kind:'Artış denenebilir',text:`Son seansta ${sets.length} set üst sınıra ve hedef RIR’e ulaştı. ${weights[0]+number(e.increment)} kg denenebilir; tekniğin ve belirtilerin uygunsa.`,weight:weights[0]+number(e.increment)};
 return {kind:'Tekrarı geliştir',text:!complete?'Son kayıt eksik set içeriyor; ağırlık artışı önerilmiyor.':!effort?'RIR hedefi sağlanmadı veya eksik. Aynı ağırlıkla temiz tekrarları takip et.':'Aynı ekipman ve ağırlıkla toplam bir temiz tekrar eklemeyi hedefle.'};
}
function totals(d,items){const t={kcal:0,protein:0,carb:0,fat:0,fiber:0};let missing=0;for(const i of items||[]){const f=d.foods[i.foodIndex];if(!f){missing++;continue;}const qty=number(i.qty);if(qty===null||qty<0){missing++;continue;}const g=i.unit==='g'?qty:qty*(number(f.servingG)||100);for(const k in t)t[k]+=(number(f[k])||0)*g/100;}return {...t,missing};}
const mealItems=(d,date)=>Object.values(d.meals[date]||{}).flat();
function nutritionWeek(d,date){const start=week(date),days=Array.from({length:7},(_,i)=>shift(start,i)).filter(k=>k<=date&&d.form3.nutritionComplete[k]);const sum=days.reduce((n,k)=>n+totals(d,mealItems(d,k)).kcal,0);return {days:days.length,total:sum,average:days.length?sum/days.length:null,difference:days.length?sum-days.length*d.targets.kcal:null};}
function volume(d,date){const planned={},done={};for(const rows of Object.values(d.program))for(const r0 of rows){const r=normalizeExercise(r0);if(r.group)planned[r.group]=(planned[r.group]||0)+Number(r.sets||0);}
 for(const w of d.workouts.filter(w=>w.date>=week(date)&&w.date<=date))for(const r of w.exercises||[]){const meta=get(r.exerciseId)||get(r.name);const group=r.group||meta?.group;if(group)done[group]=(done[group]||0)+workingSets(r).length;}
 return {planned,done};}
function newDraft(d,type,date=day(),short=false){const rows=(d.program[type]||[]).map(normalizeExercise);const id=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();return {id,date,type,planId:d.form3.planId,startedAt:Date.now(),pausedAt:null,pausedMs:0,index:0,short,exercises:rows.map((e,i)=>({...e,setData:Array.from({length:short?Math.min(e.sets,i<3?3:2):e.sets},()=>({weight:'',reps:'',rir:'',done:false,setType:'working'})),note:'',equipmentKey:'',skipped:false})),restEnd:null,rpe:'',satisfaction:'',cardio:{type:'',minutes:''}};}
function finished(draft,now=Date.now()){return {...clone(draft),durationSec:Math.max(0,Math.round(((draft.pausedAt||now)-draft.startedAt-(draft.pausedMs||0))/1000)),finishedAt:new Date(now).toISOString(),exercises:draft.exercises.map(e=>({...e,exerciseId:e.id,repRange:e.reps,targetRir:e.rir,setData:e.setData.filter(s=>s.done).map((s,i)=>({...s,set:i+1,weight:number(s.weight),reps:number(s.reps),rir:number(s.rir)}))}))};}
return {VERSION,PLAN,clone,number,day,shift,weekday,week,validDay,catalog,get,program,migrate,validBackup,planAt,normalizeExercise,workingSets,history,advice,totals,mealItems,nutritionWeek,volume,newDraft,finished};
});
