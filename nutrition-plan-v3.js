/* FORM 2.1.2 — 2400 kcal nutrition plan + practical Turkish equivalents */
(()=>{
'use strict';
const VER='2.1.2-nutrition-2400';
const TARGETS={kcal:2400,protein:195,carb:220,fat:82,fiber:30,water:4};
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N=s=>String(s||'').toLocaleLowerCase('tr-TR');
const food=(name,category,kcal,protein,carb,fat,servingG=100,unit='g',fiber=0)=>({name,category,brand:'Genel',unit,servingG,kcal,protein,carb,fat,fiber,sugar:0,sodium:0,potassium:0,calcium:0,iron:0,magnesium:0,vitC:0,vitD:0});
const PLAN_FOODS=[
 food('Beyaz peynir','Yumurta & Süt',250,15,3.3,20),
 food('Zeytin','Yağ & Sos',145,1,4,15,20,'g',3.3),
 food('Mevsim salata','Sebze & Bakliyat',20,1,4,.2),
 food('Dana kıyma az yağlı (çiğ)','Et & Tavuk',200,20,0,12),
 food('Karabuğday ekmeği','Ekmek',245,9,44,3.5,30,'dilim',6),
 food('Bulgur (çiğ)','Tahıl',342,12.3,75.9,1.3,100,'g',12.5),
 food('Makarna (çiğ)','Tahıl',371,13,75,1.5),
 food('Hindi göğsü (çiğ)','Et & Tavuk',114,23,0,1.5),
 food('Mandalina','Meyve',53,.8,13.3,.3,100,'g',1.8)
];
const PLAN={
 'Kahvaltı':[
  ['Yumurta',150,'3 adet'],
  ['Beyaz peynir',40,'40 g'],
  ['Ekmek tam buğday',90,'90 g'],
  ['Domates',100,'100 g'],
  ['Salatalık',100,'100 g'],
  ['Zeytin',20,'20 g']
 ],
 'Öğle':[
  ['Tavuk göğsü (çiğ)',300,'300 g çiğ'],
  ['Pirinç beyaz (çiğ)',80,'80 g kuru/çiğ'],
  ['Yoğurt',200,'200 g'],
  ['Mevsim salata',200,'200 g'],
  ['Zeytinyağı',5,'5 g']
 ],
 'Ara Öğün':[
  ['Whey protein',30,'1 ölçek / 30 g'],
  ['Muz',120,'120 g']
 ],
 'Akşam':[
  ['Dana kıyma az yağlı (çiğ)',200,'200 g çiğ'],
  ['Patates (çiğ)',250,'250 g çiğ'],
  ['Yoğurt',150,'150 g'],
  ['Mevsim salata',200,'200 g']
 ]
};
const EQ=[
 {title:'Kahvaltı ekmeği',base:'90 g tam buğday ekmeği',items:['90 g karabuğday ekmeği','57 g yulaf','290 g çiğ patates']},
 {title:'Öğle karbonhidratı',base:'80 g çiğ pirinç',items:['85 g çiğ bulgur','79 g çiğ makarna','380 g çiğ patates','118 g tam buğday ekmeği']},
 {title:'Öğle proteini',base:'300 g çiğ tavuk göğsü',items:['300 g çiğ hindi göğsü','290 g levrek','310 g suda ton balığı','210 g %5 yağlı dana kıyma (protein biraz daha düşük)']},
 {title:'Ara öğün meyvesi',base:'120 g muz',items:['205 g elma','230 g portakal','200 g mandalina']},
 {title:'Akşam eti',base:'200 g az yağlı dana kıyma',items:['175 g ev yapımı köfte','190 g somon','250 g tavuk göğsü + 12 g zeytinyağı']},
 {title:'Yoğurt',base:'200 g normal yoğurt',items:['330 ml ayran','200 g yoğurt yerine aynı gram ev yoğurdu; etiketi farklıysa FORM toplamı esas alınır']}
];
function dbx(){try{return db}catch{return window.db}}
function persist(){try{save()}catch{}}
function ensureFoods(){
 const d=dbx();if(!d)return;
 d.foods=d.foods||[];
 const names=new Set(d.foods.map(f=>N(f.name)));
 PLAN_FOODS.forEach(f=>{if(!names.has(N(f.name))){d.foods.push({...f});names.add(N(f.name))}});
}
function ensureSettings(){
 const d=dbx();if(!d)return;
 d.settings=d.settings||{};
 if(d.settings.nutritionPlanVersion!==VER){
  d.targets={...(d.targets||{}),...TARGETS};
  d.settings.nutritionPlanVersion=VER;
  d.settings.nutritionPlan={name:'95 → 85 / 5 ay',startedAt:'2026-10-04',targetWeight:85,startReferenceWeight:95,kcal:2400,protein:195,meals:4};
  persist();
 }
}
function idx(name){return (dbx()?.foods||[]).findIndex(f=>N(f.name)===N(name))}
function itemMacros(name,grams){
 const f=(dbx()?.foods||[])[idx(name)];if(!f)return {kcal:0,protein:0,carb:0,fat:0};
 const r=Number(grams||0)/100;
 return {kcal:Number(f.kcal||0)*r,protein:Number(f.protein||0)*r,carb:Number(f.carb||0)*r,fat:Number(f.fat||0)*r};
}
function sum(items){
 return items.reduce((a,[name,g])=>{const x=itemMacros(name,g);a.kcal+=x.kcal;a.protein+=x.protein;a.carb+=x.carb;a.fat+=x.fat;return a},{kcal:0,protein:0,carb:0,fat:0});
}
function f0(v){return Math.round(Number(v)||0).toLocaleString('tr-TR')}
function f1(v){return (Math.round((Number(v)||0)*10)/10).toLocaleString('tr-TR')}
function planTotal(){return Object.values(PLAN).reduce((a,items)=>{const x=sum(items);Object.keys(a).forEach(k=>a[k]+=x[k]);return a},{kcal:0,protein:0,carb:0,fat:0})}
function mealHtml(name,items){
 const t=sum(items);
 return '<div class="ft-plan-meal"><div class="ft-plan-meal-head"><div><h4>'+E(name)+'</h4><small>'+f0(t.kcal)+' kcal • P '+f1(t.protein)+' • K '+f1(t.carb)+' • Y '+f1(t.fat)+'</small></div><button type="button" onclick="ftApplyPlanMeal('+JSON.stringify(name)+')">Bu öğünü uygula</button></div><div class="ft-plan-foods">'+items.map(([foodName,g,label])=>{const m=itemMacros(foodName,g);return '<div><span><b>'+E(foodName)+'</b><small>'+E(label)+'</small></span><span>'+f0(m.kcal)+' kcal<br><small>P '+f1(m.protein)+'</small></span></div>'}).join('')+'</div></div>';
}
function eqHtml(){
 return '<div id="ftEqList" class="ft-eq-list" hidden><div class="ft-eq-note">Değişimler yaklaşık eşdeğerdir. Marka ve pişirme farkında FORM\'un günlük kalori/makro toplamını esas al.</div>'+EQ.map(g=>'<div class="ft-eq-group"><div><b>'+E(g.title)+'</b><small>Ana: '+E(g.base)+'</small></div><div class="ft-eq-options">'+g.items.map(x=>'<span>'+E(x)+'</span>').join('')+'</div></div>').join('')+'</div>';
}
function installCard(){
 const shell=document.querySelector('.nutri-shell');if(!shell||document.getElementById('ftNutritionPlan'))return;
 const total=planTotal(),card=document.createElement('section');card.id='ftNutritionPlan';card.className='card ft-plan-card';
 card.innerHTML='<div class="ft-plan-head"><div><span class="ft-plan-kicker">AKTİF BESLENME PLANI</span><h2>2.400 kcal • 3 ana + 1 ara öğün</h2><p>95 kg → 85 kg hedefi. Günlük protein hedefi 195 g; plan hesapta yaklaşık '+f0(total.kcal)+' kcal ve '+f0(total.protein)+' g protein verir.</p></div><div class="ft-plan-actions"><button class="primary" type="button" onclick="ftApplyPlanDay()">Planı bugüne uygula</button><button class="secondary" type="button" onclick="ftToggleEquivalents()">Eşdeğerler</button></div></div><div class="ft-plan-summary"><div><span>Kalori</span><b>'+f0(total.kcal)+'</b><small>hedef 2.400</small></div><div><span>Protein</span><b>'+f0(total.protein)+' g</b><small>hedef 195 g</small></div><div><span>Karbonhidrat</span><b>'+f0(total.carb)+' g</b><small>yaklaşık</small></div><div><span>Yağ</span><b>'+f0(total.fat)+' g</b><small>yaklaşık</small></div></div><div class="ft-plan-meals">'+Object.entries(PLAN).map(([n,it])=>mealHtml(n,it)).join('')+'</div>'+eqHtml();
 const macro=document.querySelector('.macro-board');(macro||shell.firstElementChild)?.insertAdjacentElement('afterend',card);
}
function planItems(name){
 return (PLAN[name]||[]).map(([foodName,g])=>({foodIndex:idx(foodName),qty:g,unit:'g'})).filter(x=>x.foodIndex>=0);
}
window.ftApplyPlanMeal=function(name){
 const d=dbx();if(!d)return;
 d.meals=d.meals||{};d.meals[today]=d.meals[today]||{};
 const current=d.meals[today][name]||[];
 if(current.length&&!confirm(name+' öğünündeki mevcut kayıtlar planla değiştirilecek. Devam edilsin mi?'))return;
 d.meals[today][name]=planItems(name);persist();toast(name+': plan uygulandı');renderNutrition();
};
window.ftApplyPlanDay=function(){
 const d=dbx();if(!d)return;
 const existing=Object.values(d.meals?.[today]||{}).flat().length;
 if(existing&&!confirm('Bugünkü beslenme kayıtları 2.400 kcal planıyla değiştirilecek. Devam edilsin mi?'))return;
 d.meals=d.meals||{};d.meals[today]={};
 Object.keys(PLAN).forEach(name=>{d.meals[today][name]=planItems(name)});
 d.meals[today]['Antrenman Öncesi']=[];d.meals[today]['Antrenman Sonrası']=[];
 persist();toast('2.400 kcal planı bugüne uygulandı');renderNutrition();
};
window.ftToggleEquivalents=function(){
 const x=document.getElementById('ftEqList');if(!x)return;x.hidden=!x.hidden;
 if(!x.hidden)x.scrollIntoView({behavior:'smooth',block:'nearest'});
};
function boot(){ensureFoods();ensureSettings();installCard()}
ensureFoods();ensureSettings();
const base=window.renderNutrition;
if(typeof base==='function')window.renderNutrition=function(){const r=base.apply(this,arguments);setTimeout(boot,90);return r};
setTimeout(boot,700);
window.FT_NUTRITION_PLAN={version:VER,targets:TARGETS,plan:PLAN,equivalents:EQ};
})();